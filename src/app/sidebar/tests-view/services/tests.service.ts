import { Injectable } from '@angular/core';
import { defer, firstValueFrom, from, Observable, ReplaySubject } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { Guid } from '../../../../core/guid';
import { IHeader } from '../../../toolbar/tabs/types/header.model';
import { TestsRepository } from './tests.repository';
import { ITestPlan } from '../types/test.model';
import { ITestCase } from '../types/test-item.model';

@Injectable()
export class TestsService {
    public tests: ReplaySubject<ITestPlan[]> = new ReplaySubject<ITestPlan[]>(1);
    private _testsRepository: TestsRepository;
    private _currentTests: ITestPlan[] = [];
    private _testsReady: Promise<void>;
    private _mutationQueue: Promise<void> = Promise.resolve();

    constructor(testsRepository: TestsRepository) {
        this._testsRepository = testsRepository;

        this._testsReady = firstValueFrom(this._testsRepository.getAll()).then((entries: ITestPlan[]) => {
            this._currentTests = entries;
            this.tests.next(entries);
        });
    }

    public addTest(test: ITestPlan): Observable<void> {
        return this.enqueueMutation(() => this.addTestOperation(test));
    }

    public removeTest(test: ITestPlan): Observable<void> {
        return this.enqueueMutation(() => this.removeTestOperation(test));
    }

    private addTestOperation(test: ITestPlan): Observable<void> {
        this._currentTests = [...this._currentTests.filter((x) => x.id !== test.id), test];
        this.tests.next(this._currentTests);
        return this._testsRepository.saveOrUpdate([test]);
    }

    private removeTestOperation(test: ITestPlan): Observable<void> {
        return this._testsRepository.delete(test).pipe(
            mergeMap(() => this._testsRepository.getAll()),
            tap((entries) => {
                this._currentTests = entries;
                this.tests.next(entries);
            }),
            map(() => undefined)
        );
    }

    private enqueueMutation(operation: () => Observable<void>): Observable<void> {
        return defer(() => {
            const completion = this._mutationQueue.then(() => this._testsReady).then(() => firstValueFrom(operation()));
            this._mutationQueue = completion.then(
                () => undefined,
                () => undefined
            );
            return from(completion);
        });
    }

    public newEntry(): Observable<void> {
        const newEntry = {
            id: Guid.new(),
            name: 'New Test Plan',
            tests: [] as ITestCase[]
        };
        return this.addTest(newEntry);
    }

    public createNewTest(test: ITestPlan, testItem: ITestCase): Observable<void> {
        test.tests.push(testItem);
        return this.updateTest(test);
    }

    public removeItemFromTest(test: ITestPlan, testItem: ITestCase): Observable<void> {
        test.tests = test.tests.filter((x) => x.id !== testItem.id);
        return this.updateTest(test);
    }

    public updateItemInTest(test: ITestPlan, testItem: ITestCase): Observable<void> {
        test.tests = test.tests.map((x) => {
            if (x.id === testItem.id) {
                return testItem;
            }
            return x;
        });
        return this.updateTest(test);
    }

    public updateTest(test: ITestPlan): Observable<void> {
        return this.enqueueMutation(() => this.removeTestOperation(test).pipe(mergeMap(() => this.addTestOperation(test))));
    }

    public importTests(tests: ITestPlan[]): Promise<boolean> {
        return new Promise((resolve) => {
            this._currentTests = tests ?? [];
            this.tests.next(this._currentTests);
            this._testsRepository.deleteAll().subscribe();
            this._testsRepository.saveOrUpdate(tests ?? []).subscribe();
            resolve(true);
        });
    }

    public importFileTests(data: any): Promise<boolean> {
        return new Promise((resolve) => {
            const tests = data?.tests ?? [];
            this.importTests(
                tests.map((item: any) => {
                    return {
                        id: item.name.id ? item.name : Guid.new(),
                        name: item.name,
                        tests: item.tests.map((test: any) => {
                            return {
                                id: test.id,
                                name: test.name,
                                url: test.request.request.url,
                                method: test.request.request.method,
                                request: {
                                    auth: { username: test.request.request.auth.username, password: test.request.request.auth.password },
                                    headers: test.request.request.headers.map((header: any) => {
                                        return {
                                            key: header.attribute,
                                            value: header.value
                                        } as IHeader;
                                    }),
                                    body: test.request.request.body,
                                    language: test.request.request.language
                                },
                                response: {
                                    headers: [],
                                    body: '',
                                    language: 'JSON',
                                    statusCode: 0,
                                    statusText: '',
                                    timeTaken: new Date(0),
                                    occurredAt: new Date(),
                                    size: '0 Bytes'
                                },
                                asserts: test.asserts.map((assert: any) => {
                                    return {
                                        id: assert.id,
                                        jsonPathQuery: assert.jsonPathQuery,
                                        value: assert.value,
                                        comparisonStrategy: assert.comparisonStrategy
                                    };
                                })
                            } as ITestCase;
                        })
                    } as ITestPlan;
                })
            );

            resolve(true);
        });
    }

    public getForExport(): Observable<any> {
        return this.tests.pipe(
            first(),
            map((tests) => {
                return {
                    tests: tests.map((test) => {
                        return {
                            id: test.id,
                            name: test.name,
                            tests: test.tests.map((testItem) => {
                                return {
                                    id: testItem.id,
                                    name: testItem.name,
                                    request: {
                                        body: testItem.request.body,
                                        headers: testItem.request.headers.map((header: IHeader) => {
                                            return {
                                                attribute: header.key,
                                                value: header.value
                                            };
                                        }),
                                        language: testItem.request.language,
                                        method: testItem.method,
                                        parameters: [] as string[],
                                        url: testItem.url,
                                        formdata: [] as string[],
                                        auth: testItem.request.auth,
                                        asserts: testItem.asserts.map((assert) => {
                                            return {
                                                id: assert.id,
                                                jsonPathQuery: assert.jsonPathQuery,
                                                value: assert.value,
                                                comparisonStrategy: assert.comparisonStrategy
                                            };
                                        })
                                    }
                                };
                            })
                        };
                    })
                };
            })
        );
    }
}
