import { Component, OnDestroy, OnInit } from '@angular/core';
import { HistoryService } from './services/history.service';
import { ITab } from '../../toolbar/tabs/types/tab.model';
import { Subscription } from 'rxjs';
import { TabsService } from '../../toolbar/tabs/services/tabs.service';
import { Router } from '@angular/router';

@Component({
    selector: 'history-view',
    templateUrl: './history-view.component.html',
    styleUrls: ['./history-view.component.scss']
})
export class HistoryViewComponent implements OnInit, OnDestroy {
    public entries: ITab[];

    private _subscriptions: Subscription = new Subscription();
    private _historyService: HistoryService;
    private _tabsService: TabsService;
    private _router: Router;

    constructor(historyService: HistoryService, tabsService: TabsService, router: Router) {
        this._historyService = historyService;
        this._tabsService = tabsService;
        this._router = router;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._historyService.entries.subscribe((entries) => {
                this.entries = entries.sort((a, b) => {
                    // @ts-ignore
                    return new Date(b.response.occurredAt) - new Date(a.response.occurredAt);
                });
            })
        );
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public removeItem(tab: ITab): void {
        this._historyService.removeTab(tab);
    }
}
