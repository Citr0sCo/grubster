import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, from, of, Subscription, throwError } from 'rxjs';
import { ITestPlan } from '../types/test.model';
import { TestsService } from '../services/tests.service';
import { ITestCase } from '../types/test-item.model';
import { TestRunnerService } from '../services/test-runner.service';
import { NotificationService } from '../../../../modules/ui/notification/notification.service';
import { catchError, concatAll, first, mergeMap } from 'rxjs/operators';
import { IAssert } from '../types/assert.model';
import { TestCaseHelper } from '../services/test-case.helper';

export interface ILocalTest {
    test: ITestCase;
    isRunning: boolean;
}

@Component({
    selector: 'edit-test-plan',
    templateUrl: './edit-test-plan.component.html',
    styleUrls: ['./edit-test-plan.component.scss']
})
export class EditTestPlanComponent implements OnInit, OnDestroy {
    public test: ITestPlan;
    public localTests: ILocalTest[] = [];
    public isRunning: boolean = false;

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
                this._testsService.tests.pipe(first()).subscribe((tests: ITestPlan[]) => {
                    this.test = tests.find((x) => x.id === params.id);

                    if (!this.test) {
                        this._router.navigate(['dashboard']);
                        return;
                    }

                    if (!this.test.tests) {
                        this.test.tests = [];
                    }

                    for (const test of this.test.tests) {
                        this.localTests.push({
                            test: test,
                            isRunning: false
                        });
                    }
                });
            })
        );
    }

    public isValid(): boolean {
        return this.test.name.length > 0;
    }

    public updateTest(): void {
        this._testsService.updateTest(this.test).subscribe();
        this._notificationService.logSuccess('Saved!', `"${this.test.name}" has been saved.`);
    }

    public deleteTest(): void {
        this._testsService.removeTest(this.test).subscribe();
        this._router.navigate(['dashboard']);
    }

    public runTest(localTest: ILocalTest): void {
        localTest.isRunning = true;

        this._testRunner.runTest(localTest.test).subscribe(() => {
            localTest.isRunning = false;
        });
    }

    public runAllTests(): void {
        this.isRunning = true;

        const testsToRun = [];

        for (const test of this.localTests) {
            testsToRun.push(of(test));
        }

        from(testsToRun)
            .pipe(
                concatAll(),
                mergeMap((test: ILocalTest) => forkJoin([of(test), this._testRunner.runTest(test.test)])),
                catchError((err) => throwError(err))
            )
            .subscribe(([localTest, testResult]) => {
                localTest.isRunning = false;
                this.isRunning = false;
            });
    }

    public editTab(tab: ITestCase): void {
        this._router.navigate(['test', 'case', tab.id, 'edit']);
    }

    public getStatusOfTest(test: ILocalTest): string {
        return TestCaseHelper.getStatusOf(test.test);
    }

    public getNumberOfSuccessfulAsserts(test: ILocalTest): IAssert[] {
        return TestCaseHelper.getNumberOfSuccessfulAsserts(test.test);
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
