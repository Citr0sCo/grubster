import { CollectionsService } from '../../../../../app/sidebar/collections-view/services/collections.service';
import { SuggestionsService } from '../../../../../app/request-view/request-bar/services/suggestions.service';
import { ICollectionManagementProvider } from '../../collection-management.service';
import { WebFrameworkTools } from '../../../framework/Web/WebFrameworkTools';
import { NotificationService } from '../../../../ui/notification/notification.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WebCollectionManagement implements ICollectionManagementProvider {
    private _collectionsService: CollectionsService;
    private _suggestionsService: SuggestionsService;
    private _notificationService: NotificationService;

    constructor(collectionsService: CollectionsService, suggestionsService: SuggestionsService, notificationService: NotificationService) {
        this._collectionsService = collectionsService;
        this._suggestionsService = suggestionsService;
        this._notificationService = notificationService;
    }

    public init(): void {
        // do nothing
    }

    public importCollections(): void {
        const element: HTMLInputElement = document.getElementById('import-collections-field') as HTMLInputElement;
        element.onchange = () => {
            this.importCollectionData(element.files[0], this._collectionsService, this._suggestionsService, this._notificationService);
            element.onchange = null;
        };
        element.click();
    }

    public exportCollections(): void {
        this._collectionsService.getForExport().subscribe((collections) => {
            WebFrameworkTools.downloadFile('GrubsterCollection.json', { ...collections, ...this._suggestionsService.getForExport() });
        });
    }

    public destroy(): void {
        // do nothing
    }

    private importCollectionData(file: any, collectionsService: CollectionsService, suggestionsService: SuggestionsService, notificationService: NotificationService): void {
        this._collectionsService = collectionsService;
        this._suggestionsService = suggestionsService;
        this._notificationService = notificationService;

        if (file) {
            const reader = new FileReader();

            reader.onloadend = (e) => {
                try {
                    const data = JSON.parse(reader.result.toString());
                    this._collectionsService.importFileCollections(data);
                    this._suggestionsService.importFileSuggestions(data);
                    this._notificationService.logSuccess('Collection imported!', 'Collections have been imported successfully.');
                } catch (exception) {
                    this._notificationService.logError('Failed to import a collection.', 'This could be due to an incorrect JSON format of the file.');
                }
            };

            reader.readAsText(file);
        }
    }
}
