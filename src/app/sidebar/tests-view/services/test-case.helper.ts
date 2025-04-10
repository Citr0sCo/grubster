import { ITestCase } from '../types/test-item.model';
import { IAssert } from '../types/assert.model';

export class TestCaseHelper {
    public static getStatusOf(test: ITestCase): string {
        if (test.asserts.filter((x) => x.result).length !== test.asserts.length) {
            return 'UNKNOWN';
        }

        return this.getNumberOfSuccessfulAsserts(test).length === test.asserts.length ? 'PASSED' : 'FAILED';
    }

    public static getNumberOfSuccessfulAsserts(test: ITestCase): IAssert[] {
        if (test.asserts.filter((x) => x.result).length !== test.asserts.length) {
            return [];
        }

        const matchingResult = test.asserts.filter((x) => x.result.isSuccessful);

        if (!matchingResult) {
            return [];
        }

        return matchingResult;
    }
}
