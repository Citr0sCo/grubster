import { of } from 'rxjs';
import { ITestPlan } from '../types/test.model';
import { TestsService } from './tests.service';

class InMemoryTestsRepository {
    public records: ITestPlan[] = [];

    public getAll() {
        return of(this.records);
    }

    public delete(test: ITestPlan) {
        this.records = this.records.filter((entry) => entry.id !== test.id);
        return of(undefined);
    }
}

describe('TestsService', () => {
    it('publishes the persisted list after removing a test plan', () => {
        const test = { id: 'plan-id', name: 'Plan', tests: [] } as ITestPlan;
        const remaining = { id: 'remaining-id', name: 'Remaining', tests: [] } as ITestPlan;
        const repository = new InMemoryTestsRepository();
        repository.records = [test, remaining];
        const service = new TestsService(repository as any);
        let latestTests: ITestPlan[] = [];

        service.tests.subscribe((tests) => {
            latestTests = tests;
        });
        service.removeTest(test).subscribe();

        expect(latestTests).toEqual([remaining]);
        expect(repository.records).toEqual([remaining]);
    });
});
