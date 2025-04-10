import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TabsService } from '../../toolbar/tabs/services/tabs.service';
import { Router } from '@angular/router';
import { ITab } from '../../toolbar/tabs/types/tab.model';

@Component({
    selector: 'tabs-view',
    templateUrl: './tabs-view.component.html',
    styleUrls: ['./tabs-view.component.scss']
})
export class TabsViewComponent implements OnInit, OnDestroy {
    public tabs: ITab[];

    private _subscriptions: Subscription = new Subscription();
    private _tabsService: TabsService;
    private _router: Router;

    constructor(tabsService: TabsService, router: Router) {
        this._tabsService = tabsService;
        this._router = router;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._tabsService.tabs.subscribe((entries) => {
                this.tabs = entries;
            })
        );
    }

    public addTab(): void {
        const newTab = this._tabsService.newTab();
        this._router.navigate(['/request', newTab.id]);
    }

    public removeTab(tab: ITab): void {
        this._tabsService.removeTab(tab);
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
