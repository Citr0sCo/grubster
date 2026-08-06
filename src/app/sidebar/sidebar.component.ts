import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
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
    animations: [Animations.slideInRight(), Animations.fadeIn()],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SidebarComponent implements OnInit, OnDestroy {
    private readonly _isSidebarOpen = signal(true);
    private readonly _hasTabsInSidebar = signal(false);
    private readonly _isTabsOpen = signal(true);
    private readonly _numberOfTabItems = signal(0);
    private readonly _isHistoryOpen = signal(true);
    private readonly _numberOfHistoryItems = signal(0);
    private readonly _isCollectionsOpen = signal(true);
    private readonly _isTestsOpen = signal(false);
    private readonly _numberOfCollectionItems = signal(0);
    private readonly _numberOfTestsItems = signal(0);
    private readonly _isSidebarLocked = signal(true);

    public get isSidebarOpen(): boolean {
        return this._isSidebarOpen();
    }
    public set isSidebarOpen(value: boolean) {
        this._isSidebarOpen.set(value);
    }
    public get hasTabsInSidebar(): boolean {
        return this._hasTabsInSidebar();
    }
    public set hasTabsInSidebar(value: boolean) {
        this._hasTabsInSidebar.set(value);
    }
    public get isTabsOpen(): boolean {
        return this._isTabsOpen();
    }
    public set isTabsOpen(value: boolean) {
        this._isTabsOpen.set(value);
    }
    public get numberOfTabItems(): number {
        return this._numberOfTabItems();
    }
    public set numberOfTabItems(value: number) {
        this._numberOfTabItems.set(value);
    }
    public get isHistoryOpen(): boolean {
        return this._isHistoryOpen();
    }
    public set isHistoryOpen(value: boolean) {
        this._isHistoryOpen.set(value);
    }
    public get numberOfHistoryItems(): number {
        return this._numberOfHistoryItems();
    }
    public set numberOfHistoryItems(value: number) {
        this._numberOfHistoryItems.set(value);
    }
    public get isCollectionsOpen(): boolean {
        return this._isCollectionsOpen();
    }
    public set isCollectionsOpen(value: boolean) {
        this._isCollectionsOpen.set(value);
    }
    public get isTestsOpen(): boolean {
        return this._isTestsOpen();
    }
    public set isTestsOpen(value: boolean) {
        this._isTestsOpen.set(value);
    }
    public get numberOfCollectionItems(): number {
        return this._numberOfCollectionItems();
    }
    public set numberOfCollectionItems(value: number) {
        this._numberOfCollectionItems.set(value);
    }
    public get numberOfTestsItems(): number {
        return this._numberOfTestsItems();
    }
    public set numberOfTestsItems(value: number) {
        this._numberOfTestsItems.set(value);
    }
    public get isSidebarLocked(): boolean {
        return this._isSidebarLocked();
    }
    public set isSidebarLocked(value: boolean) {
        this._isSidebarLocked.set(value);
    }
    public version: string = version;

    private _subscriptions: Subscription = new Subscription();
    private _sidebarService: SidebarService;
    private _settingsService: SettingsService;
    private _settings: ISettings | null = null;
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

        this._settings!.isHistoryOpen = this.isHistoryOpen;
        this._settingsService.update(this._settings!);
    }

    public toggleCollectionsDropdown(e: MouseEvent): void {
        e.preventDefault();
        this.isCollectionsOpen = !this.isCollectionsOpen;

        this._settings!.isCollectionsOpen = this.isCollectionsOpen;
        this._settingsService.update(this._settings!);
    }

    public toggleTestsDropdown(e: MouseEvent): void {
        e.preventDefault();
        this.isTestsOpen = !this.isTestsOpen;

        this._settings!.isTestsOpen = this.isTestsOpen;
        this._settingsService.update(this._settings!);
    }

    public toggleTabsDropdown(e: MouseEvent): void {
        e.preventDefault();
        this.isTabsOpen = !this.isTabsOpen;

        this._settings!.isTabsOpen = this.isTabsOpen;
        this._settingsService.update(this._settings!);
    }

    public toggleSidebarLock(e: MouseEvent): void {
        e.preventDefault();
        this.isSidebarLocked = !this.isSidebarLocked;

        this._settings!.isSidebarLocked = this.isSidebarLocked;
        this._settingsService.update(this._settings!);
    }

    public hasContentToShow(): boolean {
        return this.isCollectionsOpen || this.isTestsOpen || this.isHistoryOpen || this.hasTabsInSidebar;
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
