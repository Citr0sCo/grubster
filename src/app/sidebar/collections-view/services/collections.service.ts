import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { Guid } from '../../../../core/guid';
import { IHeader } from '../../../toolbar/tabs/types/header.model';
import { ITab } from '../../../toolbar/tabs/types/tab.model';
import { ICollection } from '../types/collection.model';
import { CollectionsRepository } from './collections.repository';

@Injectable()
export class CollectionsService {
    public collections: ReplaySubject<ICollection[]> = new ReplaySubject<ICollection[]>();
    private _collectionsRepository: CollectionsRepository;

    constructor(collectionsRepository: CollectionsRepository) {
        this._collectionsRepository = collectionsRepository;

        this._collectionsRepository.getAll().subscribe((entries: ICollection[]) => {
            this.collections.next(entries);
        });
    }

    public addCollection(collection: ICollection): Observable<void> {
        return this.collections.pipe(
            first(),
            mergeMap(() => this._collectionsRepository.saveOrUpdate([collection])),
            tap(() => {
                this._collectionsRepository.getAll().subscribe((collections) => {
                    this.collections.next(collections);
                });
            })
        );
    }

    public removeCollection(collection: ICollection): Observable<void> {
        return this.collections.pipe(
            first(),
            mergeMap(() => this._collectionsRepository.delete(collection)),
            tap(() => {
                this._collectionsRepository.getAll().subscribe((collections) => {
                    this.collections.next(collections);
                });
            })
        );
    }

    public newEntry(): Observable<void> {
        const newEntry = {
            id: Guid.new(),
            name: 'New Collection',
            tabs: [] as ITab[]
        };
        return this.addCollection(newEntry);
    }

    public addTabToCollection(collection: ICollection, tab: ITab): Observable<void> {
        collection.tabs.push(tab);
        return this.updateCollection(collection);
    }

    public removeTabFromCollection(collection: ICollection, tab: ITab): Observable<void> {
        collection.tabs = collection.tabs.filter((x) => x.id !== tab.id);
        return this.updateCollection(collection);
    }

    public updateTabInCollection(collection: ICollection, tab: ITab): Observable<void> {
        collection.tabs = collection.tabs.map((x) => {
            if (x.id === tab.id) {
                return tab;
            }
            return x;
        });
        return this.updateCollection(collection);
    }

    public updateCollection(collection: ICollection): Observable<void> {
        return this.removeCollection(collection).pipe(mergeMap(() => this.addCollection(collection)));
    }

    public importCollections(collections: ICollection[]): Promise<boolean> {
        return new Promise((resolve) => {
            this.collections.next(collections ?? []);
            this._collectionsRepository.deleteAll().subscribe();
            this._collectionsRepository.saveOrUpdate(collections ?? []).subscribe();
            resolve(true);
        });
    }

    public importFileCollections(data: any): Promise<boolean> {
        return new Promise((resolve) => {
            const collections = data?.collections ?? [];
            this.importCollections(
                collections.map((item: any) => {
                    return {
                        id: item.name.id ? item.name : Guid.new(),
                        name: item.name,
                        tabs: item.requests.map((tab: any) => {
                            return {
                                id: Guid.new(),
                                name: tab.name,
                                url: tab.request.request.url,
                                method: tab.request.request.method,
                                request: {
                                    auth: { username: tab.request.request.auth.username, password: tab.request.request.auth.password },
                                    headers: tab.request.request.headers.map((header: any) => {
                                        return {
                                            key: header.attribute,
                                            value: header.value
                                        } as IHeader;
                                    }),
                                    body: tab.request.request.body,
                                    language: tab.request.request.language
                                },
                                response: {
                                    headers: [],
                                    body: '',
                                    language: 'JSON'
                                }
                            } as ITab;
                        })
                    };
                })
            );

            resolve(true);
        });
    }

    public getForExport(): Observable<any> {
        return this.collections.pipe(
            first(),
            map((collections) => {
                return {
                    collections: collections.map((collection) => {
                        return {
                            id: collection.id,
                            name: collection.name,
                            requests: collection.tabs.map((tab: ITab) => {
                                return {
                                    id: tab.id,
                                    name: tab.name,
                                    request: {
                                        request: {
                                            body: tab.request.body,
                                            headers: tab.request.headers.map((header: IHeader) => {
                                                return {
                                                    attribute: header.key,
                                                    value: header.value
                                                };
                                            }),
                                            language: tab.request.language,
                                            method: tab.method,
                                            parameters: [],
                                            url: tab.url,
                                            formdata: [],
                                            auth: tab.request.auth
                                        }
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
