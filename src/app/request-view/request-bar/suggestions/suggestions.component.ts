import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ISuggestion } from '../types/suggestion.model';

@Component({
    selector: 'suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SuggestionsComponent {
    @Input()
    public suggestions: ISuggestion[] = [];

    @Output()
    public suggestionClicked: EventEmitter<ISuggestion> = new EventEmitter<ISuggestion>();

    public handleClick(suggestion: ISuggestion): void {
        this.suggestionClicked.emit(suggestion);
    }
}
