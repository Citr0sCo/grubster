import { firstValueFrom, of } from 'rxjs';
import { ITestPlan } from '../types/test.model';
import { TestsService } from './tests.service';

class InMemoryTestsRepository {
    public records: ITestPlan[] = [];

    public getAll() {
        return of([...this.records]);
    }

    public saveOrUpdate(tests: ITestPlan[]) {
        this.records = [...this.records.filter((entry) => !tests.some((test) => test.id === entry.id)), ...tests];
        return of(undefined);
    }

    public delete(test: ITestPlan) {
        this.records = this.records.filter((entry) => entry.id !== test.id);
        return of(undefined);
    }
}

describe('TestsService', () => {
    it('publishes the persisted list after removing a test plan', async () => {
        const test = { id: 'plan-id', name: 'Plan', tests: [] } as ITestPlan;
        const remaining = { id: 'remaining-id', name: 'Remaining', tests: [] } as ITestPlan;
        const repository = new InMemoryTestsRepository();
        repository.records = [test, remaining];
        const service = new TestsService(repository as any);
        let latestTests: ITestPlan[] = [];

        service.tests.subscribe((tests) => {
            latestTests = tests;
        });
        await firstValueFrom(service.removeTest(test));

        expect(latestTests).toEqual([remaining]);
        expect(repository.records).toEqual([remaining]);
    });

    it('serializes removals before adding a new test plan', async () => {
        const tests = Array.from({ length: 10 }, (_, index) => ({
            id: `plan-${index}`,
            name: `Plan ${index}`,
            tests: []
        })) as ITestPlan[];
        const repository = new InMemoryTestsRepository();
        repository.records = tests;
        const service = new TestsService(repository as any);
        let latestTests: ITestPlan[] = [];

        service.tests.subscribe((entries) => {
            latestTests = entries;
        });

        const removals = tests.slice(0, 5).map((test) => firstValueFrom(service.removeTest(test)));
        const addition = firstValueFrom(service.newEntry());
        await Promise.all([...removals, addition]);

        expect(latestTests).toHaveLength(6);
        expect(repository.records).toHaveLength(6);
        expect(repository.records).toEqual(expect.arrayContaining(tests.slice(5)));
    });
});
