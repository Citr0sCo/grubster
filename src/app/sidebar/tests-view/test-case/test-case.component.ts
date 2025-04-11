import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ITestCase } from '../types/test-item.model';
import { UrlParser } from '../../../../modules/utility/url-parser/url-parser.service';
import { TestCaseHelper } from '../services/test-case.helper';
import { TestRunnerService } from '../services/test-runner.service';

@Component({
    selector: 'test-case',
    templateUrl: './test-case.component.html',
    styleUrls: ['./test-case.component.scss'],
    standalone: false
})
export class TestCaseComponent {
    @Input()
    public testCase: ITestCase;

    public isRunning: boolean = false;

    private _router: Router;
    private _testRunner: TestRunnerService;

    constructor(router: Router, testRunner: TestRunnerService) {
        this._router = router;
        this._testRunner = testRunner;
    }

    public getResource(url: string): string {
        return UrlParser.getResource(url);
    }

    public editTest(e: MouseEvent, test: ITestCase): void {
        e.stopPropagation();
        this._router.navigate(['test', 'case', test.id, 'edit']);
    }

    public getStatusOfTest(test: ITestCase): string {
        return TestCaseHelper.getStatusOf(test);
    }

    public runTest(): void {
        this.isRunning = true;

        this._testRunner.runTest(this.testCase).subscribe(() => {
            this.isRunning = false;
        });
    }
}
