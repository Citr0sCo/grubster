import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { SidebarService } from './services/sidebar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HistoryViewComponent } from './history-view/history-view.component';
import { HistoryService } from './history-view/services/history.service';
import { UiModule } from '../../modules/ui/ui.module';
import { TimeagoModule } from 'ngx-timeago';
import { CollectionsService } from './collections-view/services/collections.service';
import { CollectionsViewComponent } from './collections-view/collections-view.component';
import { TabItemComponent } from './tab-item/tab-item.component';
import { CollectionItemComponent } from './collections-view/collection-item/collection-item.component';
import { EditCollectionComponent } from './collections-view/edit-collection/edit-collection.component';
import { FormsModule } from '@angular/forms';
import { EditTabComponent } from './edit-tab/edit-tab.component';
import { TabsViewComponent } from './tabs-view/tabs-view.component';
import { HistoryRepository } from './history-view/services/history.repository';
import { CollectionsRepository } from './collections-view/services/collections.repository';
import { TestsViewComponent } from './tests-view/tests-view.component';
import { TestsService } from './tests-view/services/tests.service';
import { TestsRepository } from './tests-view/services/tests.repository';
import { TestPlanComponent } from './tests-view/test-plan/test-plan.component';
import { EditTestPlanComponent } from './tests-view/edit-test-plan/edit-test-plan.component';
import { TestCaseComponent } from './tests-view/test-case/test-case.component';
import { EditTestCaseComponent } from './tests-view/edit-test-case/edit-test-case.component';
import { RequestPaneModule } from '../request-view/request-pane/request-pane.module';
import { TestRunnerService } from './tests-view/services/test-runner.service';

@NgModule({
    declarations: [
        SidebarComponent,
        HistoryViewComponent,
        CollectionsViewComponent,
        TabsViewComponent,
        TabItemComponent,
        CollectionItemComponent,
        EditCollectionComponent,
        EditTabComponent,
        TestsViewComponent,
        EditTestPlanComponent,
        TestPlanComponent,
        TestCaseComponent,
        EditTestCaseComponent
    ],
    imports: [BrowserModule, BrowserAnimationsModule, RouterModule, UiModule, TimeagoModule.forChild(), FormsModule, RequestPaneModule],
    providers: [SidebarService, HistoryService, HistoryRepository, CollectionsService, CollectionsRepository, TestsService, TestsRepository, TestRunnerService],
    bootstrap: [],
    exports: [SidebarComponent]
})
export class SidebarModule {
}
