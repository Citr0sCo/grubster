import { IRequest } from '../../../toolbar/tabs/types/request.model';
import { IAssert } from './assert.model';
import { IResponse } from '../../../toolbar/tabs/types/response.model';

export interface ITestCase {
    id: string;
    name: string;
    url: string;
    method: string;
    request: IRequest;
    response: IResponse;
    asserts: IAssert[];
}
