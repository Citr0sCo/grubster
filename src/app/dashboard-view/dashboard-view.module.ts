import { NgModule } from '@angular/core';
import { DashboardViewComponent } from './dashboard-view.component';
import { RouterModule } from '@angular/router';
import { dashboardViewRoutes } from './dashboard-view.routes';
import { UiModule } from '../../modules/ui/ui.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [DashboardViewComponent],
    imports: [RouterModule.forChild(dashboardViewRoutes), UiModule, CommonModule],
    providers: [],
    bootstrap: [],
    exports: [DashboardViewComponent]
})
export class DashboardViewModule {}
