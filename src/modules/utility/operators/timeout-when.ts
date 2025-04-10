import { Observable, OperatorFunction } from 'rxjs';
import { timeout } from 'rxjs/operators';

export function timeoutWhen<T>(cond: boolean, value: number): OperatorFunction<T, T> {
    return function (source: Observable<T>): Observable<T> {
        return cond ? source.pipe(timeout(value)) : source;
    };
}
