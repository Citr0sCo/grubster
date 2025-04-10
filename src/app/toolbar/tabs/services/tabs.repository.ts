import { Injectable } from '@angular/core';
import { Store } from '../../../../core/database/store';
import { Observable } from 'rxjs';
import { StorageKeys } from '../../../../core/database/storage.keys';
import { ITab } from '../types/tab.model';

@Injectable()
export class TabsRepository {
    private _store: Store;

    constructor() {
        this._store = Store.instance();
    }

    public getAll(): Observable<ITab[]> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    subscriber.next([]);
                    return;
                }

                const request = database.transaction([StorageKeys.Tabs]).objectStore(StorageKeys.Tabs).getAll();

                request.onerror = (error: any) => {
                    console.error(error);
                };

                request.onsuccess = (event: any) => {
                    subscriber.next(request.result);
                };
            });
        });
    }

    public saveOrUpdate(tabs: ITab[]): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const objectStore = database.transaction([StorageKeys.Tabs], 'readwrite').objectStore(StorageKeys.Tabs);

                tabs.forEach((tab) => {
                    const request = objectStore.add(tab);

                    request.onerror = (error: any) => {
                        console.error(error);
                    };

                    request.onsuccess = (event: any) => {
                        subscriber.complete();
                    };
                });
            });
        });
    }

    public delete(tab: ITab): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const request = database.transaction([StorageKeys.Tabs], 'readwrite').objectStore(StorageKeys.Tabs).delete(tab.id);

                request.onerror = (error: any) => {
                    console.error(error);
                };

                request.onsuccess = (event: any) => {
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

                const request = database.transaction([StorageKeys.Tabs], 'readwrite').objectStore(StorageKeys.Tabs).clear();

                request.onerror = (error: any) => {
                    console.error(error);
                };

                request.onsuccess = (event: any) => {
                    subscriber.complete();
                };
            });
        });
    }
}
