import { IHeader } from './header.model';

export interface IResponse {
    headers: IHeader[];
    body: string;
    statusCode: number;
    statusText: string;
    timeTaken: Date;
    occurredAt: Date;
    size: string;
    language: string;
}
