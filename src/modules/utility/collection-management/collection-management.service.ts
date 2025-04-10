import { Injectable } from '@angular/core';
import { WebCollectionManagement } from './providers/web/web-collection-management';

export interface ICollectionManagementProvider {
    importCollections(): void;

    exportCollections(): void;

    init(): void;

    destroy(): void;
}

@Injectable()
export class CollectionManagementService implements ICollectionManagementProvider {
    private _collectionManagement: ICollectionManagementProvider;

    constructor(webCollectionManagement: WebCollectionManagement) {
        this._collectionManagement = webCollectionManagement;
    }

    public init(): void {
        this._collectionManagement.init();
    }

    public importCollections(): void {
        this._collectionManagement.importCollections();
    }

    public exportCollections(): void {
        this._collectionManagement.exportCollections();
    }

    public destroy(): void {
        this._collectionManagement.destroy();
    }
}
