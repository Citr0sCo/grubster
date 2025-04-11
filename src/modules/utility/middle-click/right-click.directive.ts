import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[right-click]',
    standalone: false
})
export class RightClickDirective {
    @Output()
    public rightClick: EventEmitter<MouseEvent> = new EventEmitter();

    @HostListener('mouseup', ['$event'])
    public rightClickEvent(event: MouseEvent): void {
        if (event.button === 2) {
            this.rightClick.emit(event);
        }
    }
}
