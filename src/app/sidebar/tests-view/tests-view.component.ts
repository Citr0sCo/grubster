import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { TabsService } from '../../toolbar/tabs/services/tabs.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { ITestPlan } from './types/test.model';
import { TestsService } from './services/tests.service';
import { ITestCase } from './types/test-item.model';

@Component({
    selector: 'tests-view',
    templateUrl: './tests-view.component.html',
    styleUrls: ['./tests-view.component.scss'],
    standalone: false
})
export class TestsViewComponent implements OnInit, OnDestroy {
    public tests: ITestPlan[];

    private _queryString: Subject<string> = new Subject();
    private _subscriptions: Subscription = new Subscription();
    private _testsService: TestsService;
    private _tabsService: TabsService;
    private _router: Router;

    constructor(testsService: TestsService, tabsService: TabsService, router: Router) {
        this._testsService = testsService;
        this._tabsService = tabsService;
        this._router = router;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._testsService.tests.subscribe((entries) => {
                this.tests = entries.sort((a, b) => {
                    const textA = a.name.toUpperCase();
                    const textB = b.name.toUpperCase();
                    return textA < textB ? -1 : textA > textB ? 1 : 0;
                });
            })
        );
    }

    public addTest(): void {
        this._testsService.newEntry().subscribe();
    }

    public onFilterChange(filter: string): void {
        this._queryString.next(filter);
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
