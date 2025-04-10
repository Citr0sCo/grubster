import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WindowControlsComponent } from './window-controls.component';

@NgModule({
    declarations: [WindowControlsComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [],
    exports: [WindowControlsComponent]
})
export class WindowControlsModule {}
