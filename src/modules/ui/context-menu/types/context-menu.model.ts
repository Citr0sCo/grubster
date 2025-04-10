import { IContextMenuAction } from './context-menu-action.model';

export interface IContextMenu {
    x: number;
    y: number;
    actions: Array<IContextMenuAction>;
}
