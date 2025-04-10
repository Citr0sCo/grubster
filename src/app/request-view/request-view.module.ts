import { NgModule } from '@angular/core';
import { RequestViewComponent } from './request-view.component';
import { RouterModule } from '@angular/router';
import { requestViewRoutes } from './request-view.routes';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiModule } from '../../modules/ui/ui.module';
import { RequestBarComponent } from './request-bar/request-bar.component';
import { RequestPaneModule } from './request-pane/request-pane.module';

@NgModule({
    declarations: [RequestViewComponent, RequestBarComponent],
    imports: [RouterModule.forChild(requestViewRoutes), FormsModule, CommonModule, UiModule, RequestPaneModule],
    providers: [],
    bootstrap: [],
    exports: []
})
export class RequestViewModule {}
