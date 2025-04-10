import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { ITestCase } from '../types/test-item.model';
import { RequestPerformerService } from '../../../../modules/request-performer/request-performer.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { JsonPathHelper } from '../../../../core/json-path.helper';
import { IAssertResult } from '../types/assert-results.model';
import { IAssert } from '../types/assert.model';
import { ComparisonStrategy } from '../types/comparison-strategy.enum';
import { TestCaseMapper } from '../mappers/test-case.mapper';

@Injectable()
export class TestRunnerService {
    private _requestPerformer: RequestPerformerService;

    constructor(requestPerformer: RequestPerformerService) {
        this._requestPerformer = requestPerformer;
    }

    public runTest(requestedTest: ITestCase): Observable<void> {
        return new Observable((subscriber) => {
            of(requestedTest)
                .pipe(
                    mergeMap((test: ITestCase) => forkJoin([of(test), this._requestPerformer.perform(TestCaseMapper.map(test), false)])),
                    catchError((err) => throwError(err))
                )
                .subscribe(
                    ([testItem, httpResponse]) => {
                        testItem.response = httpResponse.response;

                        for (const assert of testItem.asserts) {
                            const matchingString = JsonPathHelper.apply(testItem.response.body, assert.jsonPathQuery);

                            let parsedResult = matchingString;
                            try {
                                parsedResult = JSON.parse(matchingString);
                            } catch (e) {
                                // ignore
                            }

                            assert.result = {
                                assertId: assert.id,
                                isSuccessful: this.compareResults(assert, parsedResult),
                                expected: assert.value,
                                actual: parsedResult.length > 0 ? parsedResult[0].toString() : matchingString,
                                timestamp: new Date()
                            } as IAssertResult;
                        }

                        subscriber.next();
                        subscriber.complete();
                    },
                    (error) => {
                        subscriber.error(error);
                    }
                );
        });
    }

    public compareResults(assert: IAssert, parsedResult: string): boolean {
        if (assert.comparisonStrategy === ComparisonStrategy.Equals) {
            if (parsedResult.length === 0) {
                return false;
            }
            return parsedResult[0].toString() === assert.value.toString();
        }

        if (assert.comparisonStrategy === ComparisonStrategy.Exists) {
            return parsedResult.length > 0;
        }

        if (assert.comparisonStrategy === ComparisonStrategy.NotExists) {
            return parsedResult.length === 0;
        }
    }
}
