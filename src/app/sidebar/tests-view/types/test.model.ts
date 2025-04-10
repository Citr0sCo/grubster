import { ITestCase } from './test-item.model';

export interface ITestPlan {
    id: string;
    name: string;
    tests: ITestCase[];
}
