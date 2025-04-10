import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { TabsService } from '../toolbar/tabs/services/tabs.service';
import { ITab } from '../toolbar/tabs/types/tab.model';
import { ISettings, SettingsService } from '../settings.service';
import { ICollection } from '../sidebar/collections-view/types/collection.model';
import { CollectionsService } from '../sidebar/collections-view/services/collections.service';
import { HistoryService } from '../sidebar/history-view/services/history.service';
import { EditorResizeService } from './request-pane/services/editor-resize-service';

@Component({
    selector: 'request-view',
    templateUrl: './request-view.component.html',
    styleUrls: ['./request-view.component.scss']
})
export class RequestViewComponent implements OnInit, OnDestroy {
    public currentTab: ITab;
    public settings: ISettings;

    private _subscriptions: Subscription = new Subscription();
    private _activatedRoute: ActivatedRoute;
    private _tabsService: TabsService;
    private _tabs: ITab[];
    private _router: Router;
    private _settingsService: SettingsService;
    private _collectionsService: CollectionsService;
    private _historyService: HistoryService;
    private _historyEntries: ITab[];
    private _splitterActive: boolean;
    private _splitterHasMoved: boolean;
    private _percent: number = 50;
    private _margin: number = 10;
    private _editorResizeService: EditorResizeService;

    constructor(
        activatedRoute: ActivatedRoute,
        tabsService: TabsService,
        router: Router,
        settingsService: SettingsService,
        collectionsService: CollectionsService,
        historyService: HistoryService,
        editorResizeService: EditorResizeService
    ) {
        this._activatedRoute = activatedRoute;
        this._tabsService = tabsService;
        this._router = router;
        this._settingsService = settingsService;
        this._collectionsService = collectionsService;
        this._historyService = historyService;
        this._editorResizeService = editorResizeService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._tabsService.tabs.subscribe((tabs) => {
                this._tabs = tabs;
            })
        );

        this._subscriptions.add(
            this._tabsService.activeTab.subscribe((activeTab) => {
                this.currentTab = activeTab;
            })
        );

        this._subscriptions.add(
            this._historyService.entries.subscribe((entries: ITab[]) => {
                this._historyEntries = entries;
            })
        );

        this._subscriptions.add(
            forkJoin([this._collectionsService.collections, this._activatedRoute.params]).subscribe(([collections, params]) => {
                if (params.id) {
                    const potentialCollection = collections.find((x: ICollection) => x.tabs.find((y) => y.id === params.id));
                    if (potentialCollection) {
                        const potentialTab = potentialCollection.tabs.find((x: ITab) => x.id === params.id);
                        if (potentialTab) {
                            this._tabsService.setCurrentTab(potentialTab);
                            return;
                        }
                    }

                    const potentialHistoryItem = this._historyEntries.find((x: ITab) => x.id === params.id);
                    if (potentialHistoryItem) {
                        this._tabsService.setCurrentTab(potentialHistoryItem);
                        return;
                    }

                    const potentialTabItem = this._tabs.find((x: ITab) => x.id === params.id);
                    if (potentialTabItem) {
                        this._tabsService.setCurrentTab(potentialTabItem);
                        return;
                    }
                } else {
                    if (this._tabs.length > 0) {
                        this._router.navigate(['/request', this._tabs[0].id]);
                        return;
                    } else {
                        this._router.navigate(['/dashboard']);
                        return;
                    }
                }
            })
        );

        this._subscriptions.add(
            this._settingsService.settings.subscribe((settings) => {
                this.settings = settings;
            })
        );
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public get getLeftPanePercentage(): string {
        return `${this._percent}%`;
    }

    public get getRightPanePercentage(): string {
        return `${100 - this._percent}%`;
    }

    public splitterOnClick(): void {
        if (!this._splitterHasMoved) {
            this._percent = 50;
            this._editorResizeService.resize.next(true);
        }
    }

    public splitterMouseMove(e: MouseEvent): void {
        if (e.buttons === 0 || e.which === 0) {
            this._splitterActive = false;
        }
        this.onMove(e);
    }

    public splitterMouseUp(): void {
        this._splitterActive = false;
        this._editorResizeService.resize.next(true);
    }

    public splitterMouseDown(): void {
        this._splitterActive = true;
        this._splitterHasMoved = false;
    }

    public onMove(e: any): void {
        let offset = 0;
        let target = e.currentTarget;
        let percent = 0;
        if (this._splitterActive) {
            if (!this.settings.isEditorVertical) {
                while (target) {
                    offset += target.offsetTop;
                    target = target.offsetParent;
                }
                percent = Math.floor(((e.pageY - offset) / e.currentTarget.offsetHeight) * 10000) / 100;
            } else {
                while (target) {
                    offset += target.offsetLeft;
                    target = target.offsetParent;
                }
                percent = Math.floor(((e.pageX - offset) / e.currentTarget.offsetWidth) * 10000) / 100;
            }
            if (percent > this._margin && percent < 100 - this._margin) {
                this._percent = percent;
            }
            this._editorResizeService.resize.next(true);
            this._splitterHasMoved = true;
        }
    }
}
