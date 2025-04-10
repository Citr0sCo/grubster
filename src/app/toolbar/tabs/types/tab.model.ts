import { IRequest } from './request.model';
import { IResponse } from './response.model';
import { IEnvironment } from './environment.model';

export interface ITab {
    id: string;
    name: string;
    url: string;
    method: string;
    request: IRequest;
    response: IResponse;
    jsonPathQuery: string;
    shareUrl?: string;
}
