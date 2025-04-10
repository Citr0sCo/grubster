import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar.component';
import { TabsModule } from './tabs/tabs.module';
import { LogoModule } from './logo/logo.module';
import { WindowControlsModule } from './window-controls/window-controls.module';

@NgModule({
    declarations: [ToolbarComponent],
    imports: [
        BrowserModule,
        LogoModule,
        TabsModule,
        WindowControlsModule
    ],
    providers: [],
    bootstrap: [],
    exports: [ToolbarComponent]
})
export class ToolbarModule {
}
