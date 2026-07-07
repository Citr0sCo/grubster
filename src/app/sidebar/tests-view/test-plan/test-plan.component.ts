import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ITab } from '../../../toolbar/tabs/types/tab.model';
import { TabsService } from '../../../toolbar/tabs/services/tabs.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITestPlan } from '../types/test.model';
import { TestsService } from '../services/tests.service';
import { ITestCase } from '../types/test-item.model';
import { Guid } from '../../../../core/guid';
import { HttpVerbs } from '../../../../core/http-verbs';

@Component({
    selector: 'test-plan',
    templateUrl: './test-plan.component.html',
    styleUrls: ['./test-plan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TestPlanComponent implements OnInit, OnDestroy {
    @Input()
    public test: ITestPlan | null = null;

    public isTestsOpen: boolean = true;
    public numberOfTestItems: number = 0;

    private _subscriptions: Subscription = new Subscription();
    private _router: Router;
    private _testsService: TestsService;

    constructor(router: Router, testsService: TestsService) {
        this._router = router;
        this._testsService = testsService;
    }

    public ngOnInit(): void {
        this.numberOfTestItems = this.test!.tests.length;
    }

    public createNewTest(test: ITestPlan): void {
        this._testsService.createNewTest(test, this.newTestItem()).subscribe();
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public editTest(e: MouseEvent, test: ITestPlan): void {
        e.stopPropagation();
        this._router.navigate(['test', 'plan', test.id, 'edit']);
    }

    public newTestItem(): ITestCase {
        return {
            id: Guid.new(),
            name: 'New Test Case',
            method: HttpVerbs.all()[0],
            url: '',
            request: {
                headers: [{ key: 'Content-Type', value: 'application/json' }],
                body: '',
                language: 'JSON',
                auth: { username: '', password: '' }
            },
            response: {
                headers: [],
                body: '',
                language: 'JSON',
                statusCode: 0,
                statusText: '',
                timeTaken: new Date(),
                occurredAt: new Date(),
                size: '0 Bytes'
            },
            asserts: []
        } as ITestCase;
    }
}
