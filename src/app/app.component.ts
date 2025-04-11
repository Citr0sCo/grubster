import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { CollectionManagementService } from '../modules/utility/collection-management/collection-management.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
    private readonly _settingsService: SettingsService;
    private readonly _collectionManagementService: CollectionManagementService;

    constructor(settingsService: SettingsService, collectionManagementService: CollectionManagementService) {
        this._settingsService = settingsService;
        this._collectionManagementService = collectionManagementService;
    }

    public ngOnInit(): void {
        this._settingsService.init();
        this._collectionManagementService.init();
    }

    public ngOnDestroy(): void {
        this._collectionManagementService.destroy();
    }
}
