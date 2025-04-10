import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SidebarService {
    public isSidebarOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public toggleSidebar(): void {
        this.isSidebarOpen.next(!this.isSidebarOpen.getValue());
    }
}
