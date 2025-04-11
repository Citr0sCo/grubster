import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[middle-click]',
    standalone: false
})
export class MiddleClickDirective {
    @Output()
    public middleClick: EventEmitter<MouseEvent> = new EventEmitter();

    @HostListener('mouseup', ['$event'])
    public middleClickEvent(event: MouseEvent): void {
        if (event.button === 1) {
            this.middleClick.emit(event);
        }
    }
}
