import { ITestCase } from '../types/test-item.model';
import { ITab } from '../../../toolbar/tabs/types/tab.model';

export class TestCaseMapper {
    public static map(test: ITestCase): ITab {
        return {
            id: test.id,
            name: test.name,
            url: test.url,
            method: test.method,
            request: test.request,
            response: test.response
        } as ITab;
    }
}
