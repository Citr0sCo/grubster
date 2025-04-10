import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EditorResizeService {
    public resize: Subject<boolean> = new Subject<boolean>();
}
