import { Component } from '@angular/core';
import { TabsService } from '../toolbar/tabs/services/tabs.service';
import { Router } from '@angular/router';
import { CollectionManagementService } from '../../modules/utility/collection-management/collection-management.service';
import { version } from './../../../package.json';

@Component({
    selector: 'dashboard-view',
    templateUrl: './dashboard-view.component.html',
    styleUrls: ['./dashboard-view.component.scss'],
    standalone: false
})
export class DashboardViewComponent {
    public version: string;

    private _tabsService: TabsService;
    private _router: Router;
    private _collectionManagementService: CollectionManagementService;

    constructor(tabsService: TabsService, router: Router, collectionManagementService: CollectionManagementService) {
        this._tabsService = tabsService;
        this._router = router;
        this._collectionManagementService = collectionManagementService;
        this.version = version;
    }

    public createNewTab(): void {
        const newTab = this._tabsService.newTab();
        this._router.navigate(['/request', newTab.id]);
    }

    public openImportBox(): void {
        this._collectionManagementService.importCollections();
    }

    public exportCollections(): void {
        this._collectionManagementService.exportCollections();
    }
}
