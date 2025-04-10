import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageKeys } from '../../../../core/database/storage.keys';
import { Store } from '../../../../core/database/store';
import { ITestPlan } from '../types/test.model';

@Injectable()
export class TestsRepository {
    private _store: Store;

    constructor() {
        this._store = Store.instance();
    }

    public getAll(): Observable<ITestPlan[]> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    subscriber.next([]);
                    return;
                }

                const request = database.transaction([StorageKeys.Tests]).objectStore(StorageKeys.Tests).getAll();

                request.onerror = (error: any) => {
                    console.error(error);
                    subscriber.error(error);
                };

                request.onsuccess = () => {
                    subscriber.next(request.result);
                    subscriber.complete();
                };
            });
        });
    }

    public saveOrUpdate(tests: ITestPlan[]): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const objectStore = database.transaction([StorageKeys.Tests], 'readwrite').objectStore(StorageKeys.Tests);

                tests.forEach((test) => {
                    const request = objectStore.add(test);

                    request.onerror = (error: any) => {
                        console.error(error);
                        subscriber.error(error);
                    };

                    request.onsuccess = () => {
                        subscriber.next();
                        subscriber.complete();
                    };
                });
            });
        });
    }

    public delete(test: ITestPlan): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const request = database.transaction([StorageKeys.Tests], 'readwrite').objectStore(StorageKeys.Tests).delete(test.id);

                request.onerror = (error: any) => {
                    console.error(error);
                    subscriber.error(error);
                };

                request.onsuccess = () => {
                    subscriber.next();
                    subscriber.complete();
                };
            });
        });
    }

    public deleteAll(): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const request = database.transaction([StorageKeys.Tests], 'readwrite').objectStore(StorageKeys.Tests).clear();

                request.onerror = (error: any) => {
                    console.error(error);
                    subscriber.error(error);
                };

                request.onsuccess = () => {
                    subscriber.next();
                    subscriber.complete();
                };
            });
        });
    }
}
