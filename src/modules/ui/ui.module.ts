import { NgModule } from '@angular/core';
import { MethodIndicatorComponent } from '../method-indicator/method-indicator.component';
import { StatusCodeIndicatorComponent } from '../status-code-indicator/status-code-indicator.component';
import { PayloadSizeIndicatorComponent } from '../payload-size-indicator/payload-size-indicator.component';
import { TimeTakenIndicatorComponent } from '../time-taken-indicator/time-taken-indicator.component';
import { CommonModule } from '@angular/common';
import { ToggleSwitchComponent } from './toggle-switch/toggle-switch.component';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from './badge/badge.component';
import { QuickActionComponent } from './quick-action/quick-action.component';
import { RouterModule } from '@angular/router';
import { SuggestionsService } from '../../app/request-view/request-bar/services/suggestions.service';
import { SuggestionsComponent } from '../../app/request-view/request-bar/suggestions/suggestions.component';
import { SuggestionItemComponent } from '../../app/request-view/request-bar/suggestion-item/suggestion-item.component';
import { NotificationComponent } from './notification/notification.component';
import { SuggestionsRepository } from '../../app/request-view/request-bar/services/suggestions.repository';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ContextMenuService } from './context-menu/services/context-menu.service';

const declarations = [
    MethodIndicatorComponent,
    StatusCodeIndicatorComponent,
    PayloadSizeIndicatorComponent,
    TimeTakenIndicatorComponent,
    ToggleSwitchComponent,
    BadgeComponent,
    QuickActionComponent,
    SuggestionsComponent,
    SuggestionItemComponent,
    NotificationComponent,
    ContextMenuComponent
];

@NgModule({
    declarations: declarations,
    imports: [CommonModule, FormsModule, RouterModule],
    providers: [SuggestionsService, SuggestionsRepository, ContextMenuService],
    bootstrap: [],
    exports: declarations
})
export class UiModule {
}
