import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IContextMenu } from '../types/context-menu.model';

@Injectable()
export class ContextMenuService {
    public isShowing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public contextMenu: Subject<IContextMenu> = new Subject<IContextMenu>();
}
