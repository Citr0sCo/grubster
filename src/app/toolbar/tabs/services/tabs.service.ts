import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITab } from '../types/tab.model';
import { Guid } from '../../../../core/guid';
import { Router } from '@angular/router';
import { Copy } from '../../../../core/copy';
import { TabsRepository } from './tabs.repository';

@Injectable()
export class TabsService {
    public tabs: BehaviorSubject<ITab[]> = new BehaviorSubject<ITab[]>([]);
    public activeTab: BehaviorSubject<ITab | null> = new BehaviorSubject<ITab>(null);

    private _router: Router;
    private _tabsRepository: TabsRepository;

    constructor(router: Router, tabsRepository: TabsRepository) {
        this._router = router;
        this._tabsRepository = tabsRepository;

        this._tabsRepository.getAll().subscribe((entries: ITab[]) => {
            this.tabs.next(entries);
            this.activeTab.next(this.tabs.getValue()[0]);
        });
    }

    public newTab(): ITab {
        const newTab = {
            id: Guid.new(),
            name: 'New Tab',
            method: 'get',
            request: {
                headers: [{ key: 'Content-Type', value: 'application/json' }],
                body: '',
                language: 'JSON',
                auth: { username: '', password: '' }
            },
            response: {
                headers: [],
                body: '',
                language: 'JSON'
            }
        } as ITab;

        const tabs = this.tabs.getValue();
        tabs.push(newTab);

        this.tabs.next(tabs);
        this.activeTab.next(newTab);

        this._tabsRepository.saveOrUpdate([newTab]).subscribe();

        return newTab;
    }

    public newTabFrom(tab: ITab): ITab {
        const newTab = { ...Copy.deep(tab), ...{ id: Guid.new() } };
        this.setCurrentTab(newTab);
        this._tabsRepository.saveOrUpdate([newTab]).subscribe();
        return newTab;
    }

    public removeTab(tab: ITab): void {
        const tabs = this.tabs.getValue().filter((x) => x !== tab);

        this.tabs.next(tabs);

        if (this.activeTab.getValue().id === tab.id) {
            if (tabs.length > 0) {
                this.activeTab.next(tabs[0]);
            } else {
                this.activeTab.next(null);
            }
        }

        this._tabsRepository.delete(tab).subscribe();
    }

    public setCurrentTab(tab: ITab): void {
        const currentTabs = this.tabs.getValue();
        if (currentTabs.find((x) => x.id === tab.id)) {
            this.activeTab.next(tab);
            return;
        }

        currentTabs.push(tab);
        this.tabs.next(currentTabs);
        this.activeTab.next(tab);
    }

    public duplicateTab(tab: ITab): void {
        const newTab = this.newTabFrom(tab);
        this._router.navigate(['request', newTab.id]);
    }

    public importTabs(tabs: ITab[]): Promise<boolean> {
        return new Promise((resolve) => {
            this.tabs.next(tabs ?? []);
            this._tabsRepository.deleteAll().subscribe();
            this._tabsRepository.saveOrUpdate(this.tabs.getValue()).subscribe();
            resolve(true);
        });
    }
}
