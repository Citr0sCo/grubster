import '@angular/compiler';
import { Subject } from 'rxjs';
import { ITestPlan } from '../types/test.model';
import { EditTestPlanComponent } from './edit-test-plan.component';

describe('EditTestPlanComponent', () => {
    it('waits for deletion before returning to the dashboard', () => {
        const router = { navigate: jest.fn() };
        const deletion = new Subject<void>();
        const testsService = { removeTest: jest.fn(() => deletion) };
        const component = new EditTestPlanComponent({} as any, testsService as any, router as any, {} as any, {} as any);
        const test = { id: 'plan-id', name: 'Plan', tests: [] } as ITestPlan;
        component.test = test;

        component.deleteTest();

        expect(testsService.removeTest).toHaveBeenCalledWith(test);
        expect(router.navigate).not.toHaveBeenCalled();

        deletion.next();

        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('opens a test case editor with an absolute route', () => {
        const router = { navigate: jest.fn() };
        const component = new EditTestPlanComponent({} as any, {} as any, router as any, {} as any, {} as any);
        const test = { id: 'case-id' } as any;

        component.editTab(test);

        expect(router.navigate).toHaveBeenCalledWith(['/test/case', 'case-id', 'edit']);
    });
});
