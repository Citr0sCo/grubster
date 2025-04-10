import { IEnvironment } from '../app/toolbar/tabs/types/environment.model';

export class Environments {
    public static all(): Array<IEnvironment> {
        return [
            { id: 1, name: 'local' },
            { id: 2, name: 'demo' },
            { id: 3, name: 'live' }
        ];
    }
}
