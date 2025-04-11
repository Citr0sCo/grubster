import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ICollection } from '../types/collection.model';
import { ITab } from '../../../toolbar/tabs/types/tab.model';
import { TabsService } from '../../../toolbar/tabs/services/tabs.service';
import { CollectionsService } from '../services/collections.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../modules/ui/notification/notification.service';

@Component({
    selector: 'collection-item',
    templateUrl: './collection-item.component.html',
    styleUrls: ['./collection-item.component.scss'],
    standalone: false
})
export class CollectionItemComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    public isOpened: boolean = false;

    @Input()
    public collection: ICollection;

    @Input()
    public filter: string;

    public isCollectionsOpen: boolean = false;
    public numberOfCollectionItems: number = 0;

    private _subscriptions: Subscription = new Subscription();
    private _router: Router;
    private _tabsService: TabsService;
    private _collectionsService: CollectionsService;
    private _currentTab: ITab;
    private _notificationService: NotificationService;

    constructor(router: Router, tabsService: TabsService, collectionsService: CollectionsService, notificationService: NotificationService) {
        this._router = router;
        this._tabsService = tabsService;
        this._collectionsService = collectionsService;
        this._notificationService = notificationService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._tabsService.activeTab.subscribe((currentTab) => {
                this._currentTab = currentTab;
            })
        );

        this.numberOfCollectionItems = this.collection.tabs.length;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.isOpened) {
            this.isCollectionsOpen = changes.isOpened.currentValue;
        }
    }

    public get filterMatches(): boolean {
        return this.collection.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
    }

    public get filterIndex(): number {
        if (!this.filterMatches) {
            return 0;
        }

        return this.collection.name.toLowerCase().indexOf(this.filter.toLowerCase());
    }

    public addTabToCollection(collection: ICollection): void {
        if (!this._currentTab) {
            this._notificationService.logWarn('Notice', 'Create a tab first!');
            return;
        }

        this._collectionsService.addTabToCollection(collection, this._currentTab).subscribe(() => {
            this.isCollectionsOpen = true;
        });
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public editCollection(e: MouseEvent, collection: ICollection): void {
        e.stopPropagation();
        this._router.navigate(['collection', collection.id, 'edit']);
    }
}
