import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { version } from '../../../../package.json';

@Injectable()
export class VersionCheckerService {
    public currentVersion: BehaviorSubject<string> = new BehaviorSubject<string>(version);

    constructor() {
        this.getCurrentVersion();
    }

    public getCurrentVersion(): void {
        this.currentVersion.next(version);
    }
}
