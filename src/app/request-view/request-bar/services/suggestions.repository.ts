import { Injectable } from '@angular/core';
import { Store } from '../../../../core/database/store';
import { Observable } from 'rxjs';
import { ISuggestion } from '../types/suggestion.model';
import { StorageKeys } from '../../../../core/database/storage.keys';

@Injectable()
export class SuggestionsRepository {
    private _store: Store;

    constructor() {
        this._store = Store.instance();
    }

    public getAll(): Observable<ISuggestion[]> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    subscriber.next([]);
                    return;
                }

                const request = database.transaction([StorageKeys.Suggestions]).objectStore(StorageKeys.Suggestions).getAll();

                request.onerror = (error: any) => {
                    console.error(error);
                };

                request.onsuccess = (event: any) => {
                    subscriber.next(request.result);
                };
            });
        });
    }

    public saveOrUpdate(suggestions: ISuggestion[]): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const objectStore = database.transaction([StorageKeys.Suggestions], 'readwrite').objectStore(StorageKeys.Suggestions);

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

    public delete(suggestion: ISuggestion): Observable<void> {
        return new Observable((subscriber) => {
            this._store.db.subscribe((database) => {
                if (!database) {
                    return;
                }

                const request = database.transaction([StorageKeys.Suggestions], 'readwrite').objectStore(StorageKeys.Suggestions).delete(suggestion.id);

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

                const request = database.transaction([StorageKeys.Suggestions], 'readwrite').objectStore(StorageKeys.Suggestions).clear();

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
