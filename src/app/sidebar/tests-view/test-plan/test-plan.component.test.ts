import '@angular/compiler';
import { ITestPlan } from '../types/test.model';
import { TestPlanComponent } from './test-plan.component';

describe('TestPlanComponent', () => {
    it('opens the test plan editor with an absolute route', () => {
        const router = { navigate: jest.fn() };
        const component = new TestPlanComponent(router as any, {} as any);
        const test = { id: 'plan-id', name: 'Plan', tests: [] } as ITestPlan;

        component.editTest(new MouseEvent('click'), test);

        expect(router.navigate).toHaveBeenCalledWith(['/test/plan', 'plan-id', 'edit']);
    });
});
