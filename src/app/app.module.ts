import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ToolbarModule } from './toolbar/toolbar.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UiModule } from '../modules/ui/ui.module';
import { TimeagoModule } from 'ngx-timeago';
import { AppInterceptor } from './app.interceptor';
import { UtilityModule } from '../modules/utility/utility.module';
import { MONACO_PATH, MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { environment } from '../environments/environment';
import { GlobalErrorHandler } from '../modules/utility/error-handling/global-error.handler';

@NgModule({
    declarations: [AppComponent],
    exports: [],
    bootstrap: [AppComponent],
    imports: [FormsModule, BrowserModule, TimeagoModule.forRoot(), RouterModule.forRoot(appRoutes), MonacoEditorModule, UtilityModule, UiModule, ToolbarModule, SidebarModule],
    providers: [
        AppInterceptor.forRoot(),
        { provide: MONACO_PATH, useValue: environment.monacoLocation },
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule {}
