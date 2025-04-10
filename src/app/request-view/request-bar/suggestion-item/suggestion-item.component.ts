import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISuggestion } from '../types/suggestion.model';
import { SuggestionsService } from '../services/suggestions.service';

@Component({
    selector: 'suggestion-item',
    templateUrl: './suggestion-item.component.html',
    styleUrls: ['./suggestion-item.component.scss']
})
export class SuggestionItemComponent {
    @Input()
    public suggestion: ISuggestion;

    @Output()
    public suggestionClicked: EventEmitter<ISuggestion> = new EventEmitter<ISuggestion>();

    private _suggestionsService: SuggestionsService;

    constructor(suggestionsService: SuggestionsService) {
        this._suggestionsService = suggestionsService;
    }

    public handleClick(suggestion: ISuggestion): void {
        this.suggestionClicked.emit(suggestion);
    }

    public removeSuggestion(suggestion: ISuggestion): void {
        this._suggestionsService.removeSuggestion(suggestion);
    }
}
