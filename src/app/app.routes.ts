import { Routes } from '@angular/router';
import { EditCollectionComponent } from './sidebar/collections-view/edit-collection/edit-collection.component';
import { EditTestPlanComponent } from './sidebar/tests-view/edit-test-plan/edit-test-plan.component';
import { EditTestCaseComponent } from './sidebar/tests-view/edit-test-case/edit-test-case.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'collection/:id/edit',
        component: EditCollectionComponent
    },
    {
        path: 'test/plan/:id/edit',
        component: EditTestPlanComponent
    },
    {
        path: 'test/case/:id/edit',
        component: EditTestCaseComponent
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard-view/dashboard-view.module').then((m) => m.DashboardViewModule)
    },
    {
        path: 'request',
        loadChildren: () => import('./request-view/request-view.module').then((m) => m.RequestViewModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./settings-view/settings-view.module').then((m) => m.SettingsViewModule)
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
