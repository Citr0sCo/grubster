import { Component, Input } from '@angular/core';
import { IBasicAuth } from '../../../toolbar/tabs/types/basic-auth.model';

@Component({
    selector: 'basic-auth-view',
    templateUrl: './basic-auth-view.component.html',
    styleUrls: ['./basic-auth-view.component.scss'],
    standalone: false
})
export class BasicAuthViewComponent {
    @Input()
    public auth: IBasicAuth;

    @Input()
    public isVertical: boolean = true;
}
