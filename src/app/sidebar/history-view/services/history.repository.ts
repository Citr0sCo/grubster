import { Injectable } from '@angular/core';
import { Store } from '../../../../core/database/store';
import { Observable } from 'rxjs';
import { ITab } from '../../../toolbar/tabs/types/tab.model';
import { StorageKeys } from '../../../../core/database/storage.keys';

@Injectable()
export class HistoryRepository {
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

                const request = database.transaction([StorageKeys.History]).objectStore(StorageKeys.History).getAll();

                request.onerror = (error: any) => {
                    console.error(error);
                };

                request.onsuccess = (event: any) => {
                    subscriber.next(request.result);
                };
            });
        });
    }

    public saveOrUpdate(suggestions: ITab[]): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const objectStore = database.transaction([StorageKeys.History], 'readwrite').objectStore(StorageKeys.History);

                suggestions.forEach((suggestion) => {
                    const request = objectStore.add(suggestion);

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

    public delete(suggestion: ITab): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const request = database.transaction([StorageKeys.History], 'readwrite').objectStore(StorageKeys.History).delete(suggestion.id);

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

                const request = database.transaction([StorageKeys.History], 'readwrite').objectStore(StorageKeys.History).clear();

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
