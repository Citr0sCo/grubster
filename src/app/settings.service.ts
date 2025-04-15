import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Database } from '../core/database/database';

export interface ISettings {
    isDarkModeEnabled: boolean;
    isThemeManuallyOverridden: boolean;
    isSidebarLocked: boolean;
    isHistoryOpen: boolean;
    isCollectionsOpen: boolean;
    isTestsOpen: boolean;
    isTabsOpen: boolean;
    isEditorVertical: boolean;
    isTabsInSidebar: boolean;
    editorWordWrap: boolean;
    autoBeautifyRequestBodyOnSend: boolean;
    autoBeautifyResponseBodyOnSend: boolean;
    maxResponseSizeBeforePromptInBytes: number;
    maxHistorySize: number;
    defaultToHttps: boolean;
    requestTimeoutInMs: number;
}

@Injectable()
export class SettingsService {
    public settingsEvents: BehaviorSubject<ISettings> = new BehaviorSubject<ISettings>({} as ISettings);

    private readonly _storageKey: string = 'settings';
    private _database: Database;
    private _settings: ISettings;

    public get settings(): Observable<ISettings> {
        return this.settingsEvents;
    }

    public init(): void {
        this._database = Database.instance();

        this._settings = this._database.hasItem(this._storageKey)
            ? this._database.getItem(this._storageKey)
            : {
                  isDarkModeEnabled: true,
                  isThemeManuallyOverridden: false,
                  isSidebarLocked: true,
                  isHistoryOpen: false,
                  isCollectionsOpen: true,
                  isTestsOpen: false,
                  isTabsOpen: false,
                  isEditorVertical: true,
                  isTabsInSidebar: false,
                  editorWordWrap: false,
                  autoBeautifyRequestBodyOnSend: true,
                  autoBeautifyResponseBodyOnSend: true,
                  maxResponseSizeBeforePromptInBytes: 10000000,
                  maxHistorySize: 100,
                  defaultToHttps: false,
                  requestTimeoutInMs: 10000
              };

        this.settingsEvents.next(this._settings);

        const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        darkThemeMediaQuery.addEventListener('change', (payload) => {
            this._settings.isDarkModeEnabled = payload.matches;
        });

        if (!this._settings.isThemeManuallyOverridden) {
            this._settings.isDarkModeEnabled = darkThemeMediaQuery.matches;
        }

        this.update(this._settings);
    }

    public update(settings: ISettings): void {
        this.settingsEvents.next(settings);
        this._settings = settings;
        this._database.setItem(this._storageKey, this._settings);
        this.actOnChanges();
    }

    public importSettings(settings: ISettings): Promise<boolean> {
        return new Promise((resolve) => {
            if (settings) {
                this.update(settings);
            }
            resolve(true);
        });
    }

    private actOnChanges(): void {
        document.body.classList.add('theme-fade');
        if (this._settings.isDarkModeEnabled) {
            document.body.classList.add('theme--dark');
            document.body.classList.remove('theme--light');
        } else {
            document.body.classList.remove('theme--dark');
            document.body.classList.add('theme--light');
        }

        // eslint-disable-next-line
        setTimeout(() => {
            document.body.classList.remove('theme-fade');
        }, 800);
    }
}
