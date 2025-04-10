import { ITab } from '../../../toolbar/tabs/types/tab.model';

export interface ICollection {
    id: string;
    name: string;
    tabs: ITab[];
}
