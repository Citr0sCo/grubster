import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { editorOptions } from '../../../editor.options';
import { ISettings, SettingsService } from '../../../settings.service';
import { Subscription } from 'rxjs';
import { EditorResizeService } from '../services/editor-resize-service';
import { MonacoStandaloneCodeEditor } from '@materia-ui/ngx-monaco-editor/lib/interfaces';

@Component({
    selector: 'editor-view',
    templateUrl: './editor-view.component.html',
    styleUrls: ['./editor-view.component.scss'],
    standalone: false
})
export class EditorViewComponent implements OnInit, OnDestroy {
    @Input()
    public requestBody: string;

    @Input()
    public isReadOnly: boolean = false;

    @Input()
    public isVertical: boolean = true;

    @Input()
    public fullHeight: boolean = false;

    @Output()
    public bodyChanged: EventEmitter<string> = new EventEmitter<string>();

    public options: any;

    private _subscriptions: Subscription = new Subscription();
    private _settingsService: SettingsService;
    private _settings: ISettings;
    private _rawElement: MonacoStandaloneCodeEditor;
    private _editorResizeService: EditorResizeService;

    constructor(settingsService: SettingsService, editorResizeService: EditorResizeService) {
        this._settingsService = settingsService;
        this._editorResizeService = editorResizeService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._settingsService.settings.subscribe((settings) => {
                this._settings = settings;

                let editorTheme = 'vs';
                if (this._settings.isDarkModeEnabled) {
                    editorTheme = 'vs-dark';
                }

                if (this._settings.editorWordWrap) {
                    this.options = { ...editorOptions, ...{ readOnly: this.isReadOnly, wordWrap: true, theme: editorTheme } };
                } else {
                    this.options = { ...editorOptions, ...{ readOnly: this.isReadOnly, wordWrap: false, theme: editorTheme } };
                }
            })
        );

        this._subscriptions.add(
            this._editorResizeService.resize.subscribe(() => {
                this.triggerResize();
            })
        );
    }

    public updateBody($event: any): void {
        this.bodyChanged.emit($event);
    }

    public initEditor(e: MonacoStandaloneCodeEditor): void {
        this._rawElement = e;

        this._rawElement.onKeyDown(($e: any) => {
            this.undo($e);
            this.redo($e);
        });
    }

    public triggerResize(): void {
        this._rawElement.layout();
    }

    public undo($event: any): void {
        if ($event.ctrlKey && $event.browserEvent.key.toUpperCase() === 'Z') {
            this._rawElement.trigger('Editor View', 'undo', {});
        }
    }

    public redo($event: any): void {
        if ($event.ctrlKey && $event.browserEvent.key.toUpperCase() === 'Y') {
            this._rawElement.trigger('Editor View', 'redo', {});
        }
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
