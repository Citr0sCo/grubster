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
import { HeadersItemComponent } from './headers-view/headers-item/headers-item.component';
import { EditorComponent } from 'ngx-monaco-editor-v2';

@NgModule({
    declarations: [RequestPaneComponent, EditorViewComponent, HeadersViewComponent, HeadersItemComponent, PreviewViewComponent, BasicAuthViewComponent],
    imports: [FormsModule, CommonModule, UiModule, EditorComponent],
    providers: [EditorResizeService],
    bootstrap: [],
    exports: [RequestPaneComponent, EditorViewComponent, HeadersViewComponent, BasicAuthViewComponent]
})
export class RequestPaneModule {}
