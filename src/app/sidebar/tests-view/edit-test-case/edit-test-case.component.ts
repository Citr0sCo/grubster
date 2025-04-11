import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITestPlan } from '../types/test.model';
import { TestsService } from '../services/tests.service';
import { ITestCase } from '../types/test-item.model';
import { HttpVerbs } from '../../../../core/http-verbs';
import { Guid } from '../../../../core/guid';
import { IAssert } from '../types/assert.model';
import { TestRunnerService } from '../services/test-runner.service';
import { NotificationService } from '../../../../modules/ui/notification/notification.service';
import { ComparisonStrategy } from '../types/comparison-strategy.enum';
import { BeautifyHelper } from '../../../../core/beautify.helper';
import { Copy } from '../../../../core/copy';
import { TestCaseHelper } from '../services/test-case.helper';

@Component({
    selector: 'edit-test-item',
    templateUrl: './edit-test-case.component.html',
    styleUrls: ['./edit-test-case.component.scss'],
    standalone: false
})
export class EditTestCaseComponent implements OnInit, OnDestroy {
    public test: ITestCase;
    public parentTest: ITestPlan;
    public verbs: string[] = HttpVerbs.all();
    public isRunning: boolean = false;
    public comparisonStrategy: any = ComparisonStrategy;

    private _subscriptions: Subscription = new Subscription();
    private _activatedRoute: ActivatedRoute;
    private _testsService: TestsService;
    private _router: Router;
    private _testRunner: TestRunnerService;
    private _notificationService: NotificationService;

    constructor(activatedRoute: ActivatedRoute, testsService: TestsService, router: Router, testRunner: TestRunnerService, notificationService: NotificationService) {
        this._activatedRoute = activatedRoute;
        this._testsService = testsService;
        this._router = router;
        this._testRunner = testRunner;
        this._notificationService = notificationService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._activatedRoute.params.subscribe((params: any) => {
                this._testsService.tests.subscribe((tests: ITestPlan[]) => {
                    for (const test of tests) {
                        for (const testItem of test.tests) {
                            if (testItem.id === params.id) {
                                this.parentTest = test;
                                this.test = testItem;
                                break;
                            }
                        }
                    }
                });
            })
        );
    }

    public isValid(): boolean {
        return this.test.name.length > 0;
    }

    public updateTest(): void {
        this._testsService.updateItemInTest(this.parentTest, this.test).subscribe();
        this._notificationService.logSuccess('Saved!', `"${this.test.name}" has been saved.`);
    }

    public duplicateTest(): void {
        this._testsService.createNewTest(this.parentTest, { ...Copy.deep(this.test), id: Guid.new(), name: `${this.test.name} - Copy` }).subscribe();
        this._notificationService.logSuccess('Duplicated!', `"${this.test.name}" has been duplicated.`);
    }

    public deleteTest(): void {
        this._testsService.removeItemFromTest(this.parentTest, this.test).subscribe();
        this._router.navigate(['dashboard']);
        this._notificationService.logSuccess('Deleted!', `"${this.test.name}" has been deleted.`);
    }

    public objectValues(object: any): string[] {
        return Object.values(object);
    }

    public createNewAssert(): void {
        this.test.asserts.push({ id: Guid.new(), jsonPathQuery: '', value: '', comparisonStrategy: ComparisonStrategy.Equals, result: null });
    }

    public removeAssert(assert: IAssert): void {
        this.test.asserts = this.test.asserts.filter((x) => x.id !== assert.id);
    }

    public runTest(): void {
        this.isRunning = true;

        this._testRunner.runTest(this.test).subscribe(() => {
            this.isRunning = false;
        });
    }

    public getStatusOfAssert(assert: IAssert): string {
        if (!assert.result) {
            return 'UNKNOWN';
        }

        return assert.result.isSuccessful ? 'PASSED' : 'FAILED';
    }

    public beautifyRequest(): void {
        this.test.request.body = BeautifyHelper.beautify(this.test.request.body);
    }

    public getStatusOfTest(test: ITestCase): string {
        return TestCaseHelper.getStatusOf(test);
    }

    public getNumberOfSuccessfulAsserts(test: ITestCase): IAssert[] {
        return TestCaseHelper.getNumberOfSuccessfulAsserts(test);
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
