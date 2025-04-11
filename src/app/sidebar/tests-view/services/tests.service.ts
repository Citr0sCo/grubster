import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { Guid } from '../../../../core/guid';
import { IHeader } from '../../../toolbar/tabs/types/header.model';
import { TestsRepository } from './tests.repository';
import { ITestPlan } from '../types/test.model';
import { ITestCase } from '../types/test-item.model';

@Injectable()
export class TestsService {
    public tests: ReplaySubject<ITestPlan[]> = new ReplaySubject<ITestPlan[]>();
    private _testsRepository: TestsRepository;

    constructor(testsRepository: TestsRepository) {
        this._testsRepository = testsRepository;

        this._testsRepository.getAll().subscribe((entries: ITestPlan[]) => {
            this.tests.next(entries);
        });
    }

    public addTest(test: ITestPlan): Observable<void> {
        return this.tests.pipe(
            first(),
            tap((entries) => this.tests.next([...entries.filter((x) => x.id !== test.id), test])),
            mergeMap(() => this._testsRepository.saveOrUpdate([test]))
        );
    }

    public removeTest(test: ITestPlan): Observable<void> {
        return this.tests.pipe(
            first(),
            map((entries) => entries.filter((x: ITestPlan) => x.id !== test.id)),
            tap((entries) => this.tests.next(entries)),
            mergeMap(() => this._testsRepository.delete(test))
        );
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
        return this.removeTest(test).pipe(mergeMap(() => this.addTest(test)));
    }

    public importTests(tests: ITestPlan[]): Promise<boolean> {
        return new Promise((resolve) => {
            this.tests.next(tests ?? []);
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
                                    language: 'JSON'
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
