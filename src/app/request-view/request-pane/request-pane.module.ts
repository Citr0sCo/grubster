import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiModule } from '../../../modules/ui/ui.module';
import { RequestPaneComponent } from './request-pane.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { HeadersViewComponent } from './headers-view/headers-view.component';
import { PreviewViewComponent } from './preview-view/preview-view.component';
import { BasicAuthViewComponent } from './basic-auth-view/basic-auth-view.component';
import { EditorResizeService } from './services/editor-resize-service';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { HeadersItemComponent } from './headers-view/headers-item/headers-item.component';

@NgModule({
    declarations: [RequestPaneComponent, EditorViewComponent, HeadersViewComponent, HeadersItemComponent, PreviewViewComponent, BasicAuthViewComponent],
    imports: [
        MonacoEditorModule,
        FormsModule,
        CommonModule,

        // custom
        UiModule
    ],
    providers: [EditorResizeService],
    bootstrap: [],
    exports: [RequestPaneComponent, EditorViewComponent, HeadersViewComponent, BasicAuthViewComponent]
})
export class RequestPaneModule {}
