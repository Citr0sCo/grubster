import { Component, OnDestroy, OnInit } from '@angular/core';
import { CollectionsService } from './services/collections.service';
import { Subject, Subscription } from 'rxjs';
import { TabsService } from '../../toolbar/tabs/services/tabs.service';
import { Router } from '@angular/router';
import { ICollection } from './types/collection.model';
import { ITab } from '../../toolbar/tabs/types/tab.model';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'collections-view',
    templateUrl: './collections-view.component.html',
    styleUrls: ['./collections-view.component.scss'],
    standalone: false
})
export class CollectionsViewComponent implements OnInit, OnDestroy {
    public filter: string = '';
    public filteredCollections: ICollection[] = [];

    private _queryString: Subject<string> = new Subject();
    private _collections: ICollection[];
    private _subscriptions: Subscription = new Subscription();
    private _collectionsService: CollectionsService;
    private _tabsService: TabsService;
    private _router: Router;

    constructor(collectionsService: CollectionsService, tabsService: TabsService, router: Router) {
        this._collectionsService = collectionsService;
        this._tabsService = tabsService;
        this._router = router;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._collectionsService.collections.subscribe((entries) => {
                this._collections = entries.sort((a, b) => {
                    const textA = a.name.toUpperCase();
                    const textB = b.name.toUpperCase();
                    return textA < textB ? -1 : textA > textB ? 1 : 0;
                });
                this.filteredCollections = this._collections;
            })
        );

        this._subscriptions.add(
            this._queryString.pipe(debounceTime(200)).subscribe((searchQuery) => {
                this.updateCollectionList(searchQuery);
            })
        );
    }

    public addCollection(): void {
        this._collectionsService.newEntry().subscribe();
    }

    public onFilterChange(filter: string): void {
        this._queryString.next(filter);
    }

    public updateCollectionList(filter: string): void {
        if (filter.length > 0) {
            const filteredCollections: ICollection[] = [];

            this._collections
                .filter((x: ICollection) => x.name.toUpperCase().indexOf(filter.toUpperCase()) > -1)
                .forEach((collection) => {
                    if (!filteredCollections.find((x) => x.id === collection.id)) {
                        filteredCollections.push(collection);
                    }
                });

            this._collections
                .filter((x: ICollection) =>
                    x.tabs.find((y: ITab) => y.name.toUpperCase().indexOf(filter.toUpperCase()) > -1 || y.url.toUpperCase().indexOf(filter.toUpperCase()) > -1)
                )
                .map((x: ICollection) => {
                    x.tabs = x.tabs.filter(
                        (y: ITab) => y.name.toUpperCase().indexOf(this.filter.toUpperCase()) > -1 || y.url.toUpperCase().indexOf(this.filter.toUpperCase()) > -1
                    );
                    return {
                        ...x
                    };
                })
                .forEach((collection) => {
                    if (!filteredCollections.find((x) => x.id === collection.id)) {
                        filteredCollections.push(collection);
                    }
                });

            this.filteredCollections = filteredCollections;
        } else {
            this.filteredCollections = this._collections;
        }
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
