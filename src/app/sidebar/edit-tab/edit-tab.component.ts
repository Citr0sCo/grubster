import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITab } from '../../toolbar/tabs/types/tab.model';
import { CollectionsService } from '../collections-view/services/collections.service';
import { ICollection } from '../collections-view/types/collection.model';

@Component({
    selector: 'edit-tab',
    templateUrl: './edit-tab.component.html',
    styleUrls: ['./edit-tab.component.scss']
})
export class EditTabComponent implements OnInit, OnDestroy {
    public tab: ITab;

    private _subscriptions: Subscription = new Subscription();
    private _activatedRoute: ActivatedRoute;
    private _collectionsService: CollectionsService;
    private _collection: ICollection;
    private _router: Router;

    constructor(activatedRoute: ActivatedRoute, collectionsService: CollectionsService, router: Router) {
        this._activatedRoute = activatedRoute;
        this._collectionsService = collectionsService;
        this._router = router;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._activatedRoute.params.subscribe((params) => {
                this._collectionsService.collections.subscribe((collections) => {
                    this._collection = collections.find((x) => x.tabs.find((y) => y.id === params.id));
                    if (this._collection) {
                        this.tab = this._collection.tabs.find((x) => x.id === params.id);
                    }
                });
            })
        );
    }

    public isValid(): boolean {
        return this.tab.name.length > 0;
    }

    public updateTab(): void {
        this._collectionsService.updateTabInCollection(this._collection, this.tab).subscribe();
    }

    public deleteTab(): void {
        this._collectionsService.removeTabFromCollection(this._collection, this.tab).subscribe();
        this._router.navigate(['dashboard']);
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
