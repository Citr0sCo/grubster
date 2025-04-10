import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LogoComponent } from './logo.component';
import { UiModule } from '../../../modules/ui/ui.module';

@NgModule({
    declarations: [LogoComponent],
    imports: [BrowserModule, UiModule],
    providers: [],
    bootstrap: [],
    exports: [LogoComponent]
})
export class LogoModule {}
