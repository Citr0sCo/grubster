import { NgModule } from '@angular/core';
import { SettingsViewComponent } from './settings-view.component';
import { RouterModule } from '@angular/router';
import { settingsViewRoutes } from './settings-view.routes';
import { CommonModule } from '@angular/common';
import { UiModule } from '../../modules/ui/ui.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [SettingsViewComponent],
    imports: [RouterModule.forChild(settingsViewRoutes), CommonModule, UiModule, FormsModule],
    providers: [],
    bootstrap: [],
    exports: [SettingsViewComponent]
})
export class SettingsViewModule {}
