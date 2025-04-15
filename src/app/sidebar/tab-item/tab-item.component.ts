import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ITab } from '../../toolbar/tabs/types/tab.model';
import { UrlParser } from '../../../modules/utility/url-parser/url-parser.service';
import { Router } from '@angular/router';
import { TabsService } from '../../toolbar/tabs/services/tabs.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'tab-item',
    templateUrl: './tab-item.component.html',
    styleUrls: ['./tab-item.component.scss'],
    standalone: false
})
export class TabItemComponent implements OnInit, OnDestroy {
    @Input()
    public entry: ITab;

    @Input()
    public isEditable: boolean = false;

    @Input()
    public isRemovable: boolean = false;

    @Input()
    public isTab: boolean = false;

    @Output()
    public isRemoved: EventEmitter<ITab> = new EventEmitter<ITab>();

    @Input()
    public filter: string;

    public currentTab: ITab;

    private _subscriptions: Subscription = new Subscription();
    private _router: Router;
    private _tabsService: TabsService;

    constructor(router: Router, tabsService: TabsService) {
        this._router = router;
        this._tabsService = tabsService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._tabsService.activeTab.subscribe((currentTab: ITab) => {
                this.currentTab = currentTab;
            })
        );
    }

    public getHost(url: string): string {
        return UrlParser.getHost(url);
    }

    public hasProperName(name: string, url: string): boolean {
        if (!url || this.getResource(url).length === 0) {
            return true;
        }

        return name.length > 0 && name !== 'New Tab';
    }

    public getResource(url: string): string {
        return UrlParser.getResource(url);
    }

    public setCurrentTab(event: MouseEvent, tab: ITab): void {
        if (!this.isTab || event.ctrlKey) {
            this._tabsService.duplicateTab(tab);
            return;
        }
        
        this._tabsService.setCurrentTab(tab);
    }

    public removeCurrentTab(entry: ITab): void {
        this.isRemoved.next(entry);
    }

    public editTab(e: MouseEvent, tab: ITab): void {
        e.stopPropagation();
        this._router.navigate(['request', tab.id, 'edit']);
    }

    public get filterMatches(): boolean {
        if (this.filter) {
            return this.entry.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
        }
        return false;
    }

    public get filterIndex(): number {
        if (!this.filterMatches) {
            return 0;
        }

        return this.entry.name.toLowerCase().indexOf(this.filter.toLowerCase());
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
