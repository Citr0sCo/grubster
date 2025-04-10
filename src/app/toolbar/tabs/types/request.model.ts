import { IHeader } from './header.model';
import { IBasicAuth } from './basic-auth.model';

export interface IRequest {
    auth: IBasicAuth;
    headers: IHeader[];
    body: string;
    language: string;
}
