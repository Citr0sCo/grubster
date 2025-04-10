import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../app/settings.service';
import { RequestPerformerService } from '../request-performer/request-performer.service';
import { VersionCheckerService } from './version-checker/version-checker.service';
import { CollectionManagementService } from './collection-management/collection-management.service';
import { HttpRequestMapper } from '../request-performer/mappers/http-request.mapper';
import { HttpResponseMapper } from '../request-performer/mappers/http-response.mapper';
import { LargeResponseHandlerService } from '../large-response/large-response-handler.service';
import { NotificationService } from '../ui/notification/notification.service';
import { WebCollectionManagement } from './collection-management/providers/web/web-collection-management';
import { WebLargeResponseHandlerProvider } from '../large-response/providers/web/web-large-response-handler-provider';
import { CurlParserService } from './curl-parser/curl-parser.service';

@NgModule({
    declarations: [],
    imports: [CommonModule, FormsModule, RouterModule],
    providers: [
        SettingsService,
        RequestPerformerService,
        HttpRequestMapper,
        HttpResponseMapper,
        VersionCheckerService,
        CollectionManagementService,
        LargeResponseHandlerService,
        NotificationService,
        WebCollectionManagement,
        WebLargeResponseHandlerProvider,
        CurlParserService
    ],
    bootstrap: [],
    exports: []
})
export class UtilityModule {}
