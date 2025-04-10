import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionsService } from '../services/collections.service';
import { Subscription } from 'rxjs';
import { ICollection } from '../types/collection.model';

@Component({
    selector: 'edit-collection',
    templateUrl: './edit-collection.component.html',
    styleUrls: ['./edit-collection.component.scss']
})
export class EditCollectionComponent implements OnInit, OnDestroy {
    public collection: ICollection;

    private _subscriptions: Subscription = new Subscription();
    private _activatedRoute: ActivatedRoute;
    private _collectionsService: CollectionsService;
    private _router: Router;

    constructor(activatedRoute: ActivatedRoute, collectionsService: CollectionsService, router: Router) {
        this._activatedRoute = activatedRoute;
        this._collectionsService = collectionsService;
        this._router = router;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._activatedRoute.params.subscribe((params: any) => {
                this._collectionsService.collections.subscribe((collections: ICollection[]) => {
                    this.collection = collections.find((x) => x.id === params.id);
                });
            })
        );
    }

    public isValid(): boolean {
        return this.collection.name.length > 0;
    }

    public updateCollection(): void {
        this._collectionsService.updateCollection(this.collection).subscribe();
    }

    public deleteCollection(): void {
        this._collectionsService.removeCollection(this.collection).subscribe();
        this._router.navigate(['dashboard']);
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
