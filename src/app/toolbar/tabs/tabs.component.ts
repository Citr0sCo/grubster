import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ITab } from './types/tab.model';
import { TabsService } from './services/tabs.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UrlParser } from '../../../modules/utility/url-parser/url-parser.service';
import { ISettings, SettingsService } from '../../settings.service';
import { ContextMenuService } from '../../../modules/ui/context-menu/services/context-menu.service';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnDestroy {
    public tabs: ITab[];
    public currentTab: ITab;
    public isTabsInSidebar: boolean = false;

    private _subscriptions: Subscription = new Subscription();
    private _tabsService: TabsService;
    private _router: Router;
    private _settingsService: SettingsService;
    private _contextMenuService: ContextMenuService;

    constructor(tabsService: TabsService, router: Router, settingsService: SettingsService, contextMenuService: ContextMenuService) {
        this._tabsService = tabsService;
        this._router = router;
        this._settingsService = settingsService;
        this._contextMenuService = contextMenuService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._tabsService.tabs.subscribe((tabs) => {
                this.tabs = tabs;
            })
        );

        this._subscriptions.add(
            this._settingsService.settings.subscribe((settings: ISettings) => {
                this.isTabsInSidebar = settings.isTabsInSidebar;
            })
        );

        this._subscriptions.add(
            this._tabsService.activeTab.subscribe((activeTab) => {
                this.currentTab = activeTab;
            })
        );
    }

    public setCurrentTab(event: MouseEvent, tab: ITab): void {
        if (event.ctrlKey) {
            this._tabsService.duplicateTab(tab);
            return;
        }
        this._router.navigate(['/request', tab.id]);
        this._tabsService.setCurrentTab(tab);
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public createNewTab(): void {
        const newTab = this._tabsService.newTab();
        this._router.navigate(['/request', newTab.id]);
    }

    public closeTab(tab: ITab): void {
        this._tabsService.removeTab(tab);
        if (this.currentTab?.id === tab.id) {
            if (this.tabs.length > 0) {
                this._router.navigate(['/request', this.tabs[this.tabs.length - 1].id]);
            }
        }
        if (this.tabs.length > 0) {
            this._router.navigate(['/request', this.tabs[this.tabs.length - 1].id]);
        } else {
            this._router.navigate([`/dashboard`]);
        }
    }

    public duplicateTab(tab: ITab): void {
        const newTab = this._tabsService.newTabFrom(tab);
        this._router.navigate(['/request', newTab.id]);
    }

    public closeOtherTabs(tab: ITab): void {
        this._tabsService.importTabs([tab]);
        this._router.navigate(['/request', tab.id]);
    }

    public closeAllToLeft(tab: ITab): void {
        const index = this.tabs.indexOf(tab);
        this.tabs.splice(0, index);

        this._tabsService.importTabs(this.tabs);
        this._router.navigate(['/request', tab.id]);
    }

    public closeAllToRight(tab: ITab): void {
        const index = this.tabs.indexOf(tab);
        this.tabs.splice(index + 1, this.tabs.length);

        this._tabsService.importTabs(this.tabs);
        this._router.navigate(['/request', tab.id]);
    }

    @HostListener('document:keydown', ['$event'])
    public handleKeyShortcuts($event: KeyboardEvent): void {
        if ($event.ctrlKey && $event.key.toUpperCase() === 'T') {
            $event.preventDefault();
            this.createNewTab();
        }
    }

    @HostListener('document:mouseup', ['$event'])
    public handleMouseEvent($event: any): void {
        if ($event.path && $event.path.find((x: HTMLElement) => x.nodeName && x.nodeName.toUpperCase() === 'CONTEXT-MENU')) {
            return;
        }
        if ($event.button !== 2) {
            this._contextMenuService.isShowing.next(false);
        }
    }

    @HostListener('window:contextmenu', ['$event'])
    public preventRightClick($event: MouseEvent): void {
        $event.preventDefault();
    }

    public hasProperName(name: string, url: string): boolean {
        if (!url || this.getResource(url).length === 0) {
            return true;
        }

        return name.length > 0 && name !== 'New Tab';
    }

    public getResource(url: string): string {
        return UrlParser.getResource(url) ?? '';
    }

    public openContextMenu(event: MouseEvent, tab: ITab): void {
        this._contextMenuService.contextMenu.next({
            x: event.clientX,
            y: event.clientY,
            actions: [
                {
                    icon: 'fas fa-clone',
                    name: 'Duplicate',
                    callback: () => {
                        this.duplicateTab(tab);
                    }
                },
                {
                    icon: 'fas fa-minus',
                    name: 'Close',
                    callback: () => {
                        this.closeTab(tab);
                    }
                },
                {
                    icon: 'fas fa-anchor',
                    name: 'Close All But This',
                    callback: () => {
                        this.closeOtherTabs(tab);
                    }
                },
                {
                    icon: 'fas fa-arrow-left',
                    name: 'Close All to the Left',
                    callback: () => {
                        this.closeAllToLeft(tab);
                    }
                },
                {
                    icon: 'fas fa-arrow-right',
                    name: 'Close All to the Right',
                    callback: () => {
                        this.closeAllToRight(tab);
                    }
                }
            ]
        });
        this._contextMenuService.isShowing.next(true);
    }
}
