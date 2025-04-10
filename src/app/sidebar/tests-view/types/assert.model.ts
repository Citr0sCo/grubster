import { ComparisonStrategy } from './comparison-strategy.enum';
import { IAssertResult } from './assert-results.model';

export interface IAssert {
    id: string;
    jsonPathQuery: string;
    value: string;
    comparisonStrategy: ComparisonStrategy;
    result: IAssertResult;
}
