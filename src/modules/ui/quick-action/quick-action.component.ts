import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'quick-action',
    templateUrl: './quick-action.component.html',
    styleUrls: ['./quick-action.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class QuickActionComponent {
    @Input()
    public isPrimary: boolean = false;

    @Input()
    public isDangerous: boolean = false;

    @Input()
    public icon: string = '';

    @Input()
    public prefix: string = '';

    @Input()
    public label: string = '';

    @Input()
    public isSyncing: boolean = false;

    @Output()
    public clicked: EventEmitter<boolean> = new EventEmitter<boolean>();

    public callback(): void {
        this.clicked.emit(true);
    }
}
