import { Routes } from '@angular/router';
import { RequestViewComponent } from './request-view.component';
import { EditTabComponent } from '../sidebar/edit-tab/edit-tab.component';

export const requestViewRoutes: Routes = [
    { path: '', component: RequestViewComponent },
    { path: ':id', component: RequestViewComponent },
    { path: ':id/edit', component: EditTabComponent }
];
