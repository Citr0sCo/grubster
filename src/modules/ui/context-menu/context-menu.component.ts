import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContextMenuService } from './services/context-menu.service';
import { Subscription } from 'rxjs';
import { IContextMenu } from './types/context-menu.model';
import { IContextMenuAction } from './types/context-menu-action.model';

@Component({
    selector: 'context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, OnDestroy {
    public isShowing: boolean;
    public contextMenu: IContextMenu;

    private _contextMenuService: ContextMenuService;
    private _subscriptions: Subscription = new Subscription();

    constructor(contextMenuService: ContextMenuService) {
        this._contextMenuService = contextMenuService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._contextMenuService.contextMenu.subscribe((contextMenu: IContextMenu) => {
                this.contextMenu = contextMenu;
            })
        );
        this._subscriptions.add(
            this._contextMenuService.isShowing.subscribe((isShowing: boolean) => {
                this.isShowing = isShowing;
            })
        );
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public execute(action: IContextMenuAction): void {
        action.callback();
        this._contextMenuService.isShowing.next(false);
    }
}
