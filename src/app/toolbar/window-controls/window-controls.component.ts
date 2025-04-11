import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'window-controls',
    templateUrl: './window-controls.component.html',
    styleUrls: ['./window-controls.component.scss'],
    providers: [],
    standalone: false
})
export class WindowControlsComponent implements OnInit {
    public isMaximized: boolean = false;

    public ngOnInit(): void {
        this.isMaximized = false;
    }

    public minimize(): void {
        this.isMaximized = false;
    }

    public maximize(): void {
        this.isMaximized = true;
    }

    public unMaximize(): void {
        this.isMaximized = false;
    }

    public quit(): void {}
}
