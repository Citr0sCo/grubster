import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TabsComponent } from './tabs.component';
import { TabsService } from './services/tabs.service';
import { RouterModule } from '@angular/router';
import { MiddleClickDirective } from '../../../modules/utility/middle-click/middle-click.directive';
import { RightClickDirective } from '../../../modules/utility/middle-click/right-click.directive';
import { TabsRepository } from './services/tabs.repository';

@NgModule({
    declarations: [TabsComponent, MiddleClickDirective, RightClickDirective],
    imports: [BrowserModule, RouterModule],
    providers: [TabsService, TabsRepository, MiddleClickDirective, RightClickDirective],
    bootstrap: [],
    exports: [TabsComponent]
})
export class TabsModule {}
