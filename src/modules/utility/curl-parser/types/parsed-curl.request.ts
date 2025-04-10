import { IHeader } from '../../../../app/toolbar/tabs/types/header.model';

export interface IParsedCurlRequest {
    headers: IHeader[];
    url: string;
    method: string;
    body: string;
}
