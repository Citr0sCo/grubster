import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../sidebar/services/sidebar.service';
import { Subscription } from 'rxjs';
import { ISettings, SettingsService } from '../../settings.service';
import { DEPLOY_URL } from '../../deploy-url';

@Component({
    selector: 'logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit, OnDestroy {
    public deployUrl: string;

    private _subscriptions: Subscription = new Subscription();
    private _sidebarService: SidebarService;
    private _settingsService: SettingsService;
    private _settings: ISettings;

    constructor(sidebarService: SidebarService, settingsService: SettingsService, @Inject(DEPLOY_URL) deployUrl: string) {
        this._sidebarService = sidebarService;
        this._settingsService = settingsService;
        this.deployUrl = deployUrl;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._settingsService.settings.subscribe((settings: ISettings) => {
                this._settings = settings;
            })
        );
    }

    public toggleSidebar(): void {
        if (!this._settings.isSidebarLocked) {
            this._sidebarService.toggleSidebar();
        }
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
