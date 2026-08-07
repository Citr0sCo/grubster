import '@angular/compiler';
import { ITestCase } from '../types/test-item.model';
import { TestCaseComponent } from './test-case.component';

describe('TestCaseComponent', () => {
    it('opens the test-case editor with an absolute route', () => {
        const router = { navigate: jest.fn() };
        const component = new TestCaseComponent(router as any, {} as any);
        const test = { id: 'case-id' } as ITestCase;
        const event = new MouseEvent('click');
        jest.spyOn(event, 'stopPropagation');

        component.editTest(event, test);

        expect(event.stopPropagation).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/test/case', 'case-id', 'edit']);
    });
});
