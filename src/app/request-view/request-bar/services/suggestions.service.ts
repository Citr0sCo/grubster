import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Guid } from '../../../../core/guid';
import { ISuggestion } from '../types/suggestion.model';
import { SuggestionsRepository } from './suggestions.repository';

@Injectable()
export class SuggestionsService {
    public suggestions: BehaviorSubject<ISuggestion[]> = new BehaviorSubject<ISuggestion[]>([]);
    private _suggestionsRepository: SuggestionsRepository;

    constructor(suggestionsRepository: SuggestionsRepository) {
        this._suggestionsRepository = suggestionsRepository;

        this._suggestionsRepository.getAll().subscribe((suggestions: ISuggestion[]) => {
            this.suggestions.next(suggestions);
        });
    }

    public addSuggestion(suggestion: string): void {
        const entries = this.suggestions.getValue();

        if (!entries.find((x: ISuggestion) => x.value.toUpperCase() === suggestion.toUpperCase())) {
            const newSuggestion = {
                id: Guid.new(),
                value: suggestion
            };

            entries.push(newSuggestion);
            this.suggestions.next(entries);

            this._suggestionsRepository.saveOrUpdate([newSuggestion]).subscribe();
        }
    }

    public removeSuggestion(suggestion: ISuggestion): void {
        const entries = this.suggestions.getValue().filter((x: ISuggestion) => x !== suggestion);
        this.suggestions.next(entries);

        this._suggestionsRepository.delete(suggestion).subscribe();
    }

    public importSuggestions(suggestions: ISuggestion[]): Promise<boolean> {
        return new Promise((resolve) => {
            this._suggestionsRepository.deleteAll().subscribe();

            this.suggestions.next(suggestions ?? []);

            this._suggestionsRepository.saveOrUpdate(this.suggestions.getValue()).subscribe();

            resolve(true);
        });
    }

    public importFileSuggestions(data: any): Promise<boolean> {
        return new Promise((resolve) => {
            const suggestions = data?.requestHistory ?? [];
            this.importSuggestions(
                suggestions.map((item: string) => {
                    return {
                        id: Guid.new(),
                        value: item
                    };
                })
            );
            resolve(true);
        });
    }

    public getForExport(): any {
        return {
            requestHistory: this.suggestions.getValue().map((x: ISuggestion) => x.value)
        };
    }
}
