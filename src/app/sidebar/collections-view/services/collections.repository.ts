import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageKeys } from '../../../../core/database/storage.keys';
import { Store } from '../../../../core/database/store';
import { ICollection } from '../types/collection.model';

@Injectable()
export class CollectionsRepository {
    private _store: Store;

    constructor() {
        this._store = Store.instance();
    }

    public getAll(): Observable<ICollection[]> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    subscriber.next([]);
                    return;
                }

                const request = database.transaction([StorageKeys.Collections]).objectStore(StorageKeys.Collections).getAll();

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

    public saveOrUpdate(collections: ICollection[]): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const objectStore = database.transaction([StorageKeys.Collections], 'readwrite').objectStore(StorageKeys.Collections);

                collections.forEach((collection) => {
                    const request = objectStore.add(collection);

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

    public delete(collection: ICollection): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const request = database.transaction([StorageKeys.Collections], 'readwrite').objectStore(StorageKeys.Collections).delete(collection.id);

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

                const request = database.transaction([StorageKeys.Collections], 'readwrite').objectStore(StorageKeys.Collections).clear();

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
