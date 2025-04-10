import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITab } from '../../../toolbar/tabs/types/tab.model';
import { Guid } from '../../../../core/guid';
import { ISettings, SettingsService } from '../../../settings.service';
import { HistoryRepository } from './history.repository';
import { Copy } from '../../../../core/copy';

@Injectable()
export class HistoryService {
    public entries: BehaviorSubject<ITab[]> = new BehaviorSubject<ITab[]>([]);

    private _settingsService: SettingsService;
    private _settings: ISettings;
    private _historyRepository: HistoryRepository;

    constructor(settingsService: SettingsService, historyRepository: HistoryRepository) {
        this._settingsService = settingsService;
        this._historyRepository = historyRepository;

        this._settingsService.settings.subscribe((settings) => {
            this._settings = settings;
        });

        this._historyRepository.getAll().subscribe((entries: ITab[]) => {
            this.entries.next(entries);
        });
    }

    public addEntry(tab: ITab): void {
        const clonedTab = { ...Copy.deep(tab), ...{ id: Guid.new() } };
        const entries = this.entries.getValue();

        while (entries.length >= this._settings.maxHistorySize) {
            entries.pop();
        }

        entries.push(clonedTab);
        this.entries.next(entries);

        this._historyRepository.saveOrUpdate([clonedTab]).subscribe();
    }

    public removeTab(tab: ITab): void {
        const entries = this.entries.getValue().filter((x) => x !== tab);
        this.entries.next(entries);

        this._historyRepository.delete(tab).subscribe();
    }

    public importEntries(entries: ITab[]): Promise<boolean> {
        return new Promise((resolve) => {
            this.entries.next(entries ?? []);

            this._historyRepository.saveOrUpdate(this.entries.getValue()).subscribe();

            resolve(true);
        });
    }
}
