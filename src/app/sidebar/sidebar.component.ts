import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from './services/sidebar.service';
import { Subscription } from 'rxjs';
import { Animations } from '../../core/animations';
import { ISettings, SettingsService } from '../settings.service';
import { HistoryService } from './history-view/services/history.service';
import { CollectionsService } from './collections-view/services/collections.service';
import { ICollection } from './collections-view/types/collection.model';
import { ITab } from '../toolbar/tabs/types/tab.model';
import { TabsService } from '../toolbar/tabs/services/tabs.service';
import { version } from './../../../package.json';
import { TestsService } from './tests-view/services/tests.service';
import { ITestPlan } from './tests-view/types/test.model';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [Animations.slideInRight(), Animations.fadeIn()]
})
export class SidebarComponent implements OnInit, OnDestroy {
    public isSidebarOpen: boolean = true;
    public hasTabsInSidebar: boolean = false;
    public isTabsOpen: boolean = true;
    public numberOfTabItems: number = 0;
    public isHistoryOpen: boolean = true;
    public numberOfHistoryItems: number = 0;
    public isCollectionsOpen: boolean = true;
    public isTestsOpen: boolean = false;
    public numberOfCollectionItems: number = 0;
    public numberOfTestsItems: number = 0;
    public isSidebarLocked: boolean = true;
    public isSyncing: boolean = false;
    public version: string = version;

    private _subscriptions: Subscription = new Subscription();
    private _sidebarService: SidebarService;
    private _settingsService: SettingsService;
    private _settings: ISettings;
    private _historyService: HistoryService;
    private _collectionsService: CollectionsService;
    private _tabsService: TabsService;
    private _testsService: TestsService;

    constructor(
        sidebarService: SidebarService,
        settingsService: SettingsService,
        historyService: HistoryService,
        collectionsService: CollectionsService,
        tabsService: TabsService,
        testsService: TestsService
    ) {
        this._sidebarService = sidebarService;
        this._settingsService = settingsService;
        this._historyService = historyService;
        this._collectionsService = collectionsService;
        this._tabsService = tabsService;
        this._testsService = testsService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._sidebarService.isSidebarOpen.subscribe((isSidebarOpen: boolean) => {
                this.isSidebarOpen = isSidebarOpen;
            })
        );
        this._subscriptions.add(
            this._settingsService.settings.subscribe((settings: ISettings) => {
                this._settings = settings;
                if (!this.isSidebarOpen) {
                    this.isSidebarOpen = settings.isSidebarLocked;
                }
                this.isSidebarLocked = settings.isSidebarLocked;
                this.isHistoryOpen = settings.isHistoryOpen;
                this.isCollectionsOpen = settings.isCollectionsOpen;
                this.hasTabsInSidebar = settings.isTabsInSidebar;
                this.isTestsOpen = settings.isTestsOpen;
            })
        );
        this._subscriptions.add(
            this._historyService.entries.subscribe((entries: ITab[]) => {
                this.numberOfHistoryItems = entries.length;
            })
        );
        this._subscriptions.add(
            this._collectionsService.collections.subscribe((entries: ICollection[]) => {
                this.numberOfCollectionItems = entries.length;
            })
        );
        this._subscriptions.add(
            this._testsService.tests.subscribe((entries: ITestPlan[]) => {
                this.numberOfTestsItems = entries.length;
            })
        );
        this._subscriptions.add(
            this._tabsService.tabs.subscribe((tabs: ITab[]) => {
                this.numberOfTabItems = tabs.length;
            })
        );
    }

    public toggleSidebar(): void {
        if (!this.isSidebarLocked) {
            this._sidebarService.toggleSidebar();
        }
    }

    public toggleHistoryDropdown(e: MouseEvent): void {
        e.preventDefault();
        this.isHistoryOpen = !this.isHistoryOpen;

        this._settings.isHistoryOpen = this.isHistoryOpen;
        this._settingsService.update(this._settings);
    }

    public toggleCollectionsDropdown(e: MouseEvent): void {
        e.preventDefault();
        this.isCollectionsOpen = !this.isCollectionsOpen;

        this._settings.isCollectionsOpen = this.isCollectionsOpen;
        this._settingsService.update(this._settings);
    }

    public toggleTestsDropdown(e: MouseEvent): void {
        e.preventDefault();
        this.isTestsOpen = !this.isTestsOpen;

        this._settings.isTestsOpen = this.isTestsOpen;
        this._settingsService.update(this._settings);
    }

    public toggleTabsDropdown(e: MouseEvent): void {
        e.preventDefault();
        this.isTabsOpen = !this.isTabsOpen;

        this._settings.isTabsOpen = this.isTabsOpen;
        this._settingsService.update(this._settings);
    }

    public toggleSidebarLock(e: MouseEvent): void {
        e.preventDefault();
        this.isSidebarLocked = !this.isSidebarLocked;

        this._settings.isSidebarLocked = this.isSidebarLocked;
        this._settingsService.update(this._settings);
    }

    public hasContentToShow(): boolean {
        return this.isCollectionsOpen || this.isTestsOpen || this.isHistoryOpen || this.hasTabsInSidebar;
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
