import { Component, View } from 'angular2/core';
import { SearchResult, WikiService } from './wiki-service';

// Annotation section
@Component({
	selector: 'wiki-viewer',
	viewBindings: [WikiService]
})
@View({
	templateUrl: '../html/wiki-viewer.html',
	styleUrls: ['../css/wiki-viewer.css']
})
// Component controller
export class WikiViewerComp {
	
	showingResults = false;
	searchClasses  = {
		'search-results': this.showingResults,
		'search-noresults': !this.showingResults
	}

	constructor(public wikiService: WikiService) {

	}
	
	generateSuggestions(query: string) {
		if (!query) {
			this.wikiService.suggestions = [];
			return;
		}
		this.wikiService.generateSuggestions(query);
	}
	
	updateSearch(searchBar, suggestion: string) {
		searchBar.value = suggestion;
		this.generateSuggestions(suggestion);
	}
	
	showResults(query: string) {
		if (!query) return;
		this.invertSearchPosition();
		this.wikiService.showResults();
	}
	
	invertSearchPosition() {
		this.showingResults = !this.showingResults;
	}
	
	searchPosition() {
		this.searchClasses['search-results'] = this.showingResults;
		this.searchClasses['search-noresults'] = !this.showingResults;
		return this.searchClasses;
	}
}