import { Component, OnDestroy, OnInit } from '@angular/core';
import { version } from './../../../package.json';
import { ISettings, SettingsService } from '../settings.service';
import { Subscription } from 'rxjs';
import { CollectionManagementService } from '../../modules/utility/collection-management/collection-management.service';
import { NotificationService } from '../../modules/ui/notification/notification.service';
import { Store } from '../../core/database/store';

@Component({
    selector: 'settings-view',
    templateUrl: './settings-view.component.html',
    styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit, OnDestroy {
    public version: string;
    public settings: ISettings;

    private _subscriptions: Subscription = new Subscription();
    private _settingsService: SettingsService;
    private _collectionManagementService: CollectionManagementService;
    private _notificationService: NotificationService;
    private _store: Store;

    constructor(settingsService: SettingsService, collectionManagementService: CollectionManagementService, notificationService: NotificationService) {
        this._settingsService = settingsService;
        this._collectionManagementService = collectionManagementService;
        this._notificationService = notificationService;
        this.version = version;
        this._store = Store.instance();
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._settingsService.settings.subscribe((settings: ISettings) => {
                this.settings = settings;
            })
        );
    }

    public toggleDarkMode(): void {
        this.settings.isDarkModeEnabled = !this.settings.isDarkModeEnabled;
        this.settings.isThemeManuallyOverridden = true;
        this.applySettings(this.settings);
    }

    public toggleSidebar(): void {
        this.settings.isSidebarLocked = !this.settings.isSidebarLocked;
        this.applySettings(this.settings);
    }

    public toggleCollections(): void {
        this.settings.isCollectionsOpen = !this.settings.isCollectionsOpen;
        this.applySettings(this.settings);
    }

    public toggleTests(): void {
        this.settings.isTestsOpen = !this.settings.isTestsOpen;
        this.applySettings(this.settings);
    }

    public toggleHistory(): void {
        this.settings.isHistoryOpen = !this.settings.isHistoryOpen;
        this.applySettings(this.settings);
    }

    public toggleVerticalEditors(): void {
        this.settings.isEditorVertical = !this.settings.isEditorVertical;
        this.applySettings(this.settings);
    }

    public toggleTabsInSidebar(): void {
        this.settings.isTabsInSidebar = !this.settings.isTabsInSidebar;
        this.applySettings(this.settings);
    }

    public toggleEditorWordWrap(): void {
        this.settings.editorWordWrap = !this.settings.editorWordWrap;
        this.applySettings(this.settings);
    }

    public toggleAutoBeautifyRequestOnSend(): void {
        this.settings.autoBeautifyRequestBodyOnSend = !this.settings.autoBeautifyRequestBodyOnSend;
        this.applySettings(this.settings);
    }

    public toggleAutoBeautifyResponseOnSend(): void {
        this.settings.autoBeautifyResponseBodyOnSend = !this.settings.autoBeautifyResponseBodyOnSend;
        this.applySettings(this.settings);
    }

    public toggleDefaultToHttps(): void {
        this.settings.defaultToHttps = !this.settings.defaultToHttps;
        this.applySettings(this.settings);
    }

    public toggleIncludeCustomHeaders(): void {
        this.settings.includeCustomHeaders = !this.settings.includeCustomHeaders;
        this.applySettings(this.settings);
    }

    public toggleAutoSync(): void {
        this.settings.autoSync = !this.settings.autoSync;
        this.applySettings(this.settings);
    }

    public applySettings(settings: ISettings): void {
        this._settingsService.update(settings);
        this._notificationService.logSuccess('Settings saved!', 'Settings have been saved successfully.');
    }

    public openImportBox(): void {
        this._collectionManagementService.importCollections();
    }

    public exportCollections(): void {
        this._collectionManagementService.exportCollections();
    }

    public clearLocalStorage(): void {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
        window.indexedDB.deleteDatabase(this._store.DATABASE_NAME);
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
