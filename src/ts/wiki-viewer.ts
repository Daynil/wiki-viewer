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

	constructor(public wikiService: WikiService) {
		
	}
	
	generateSuggestions(query: string) {
		if (!query) {
			this.wikiService.suggestions = [];
			return;
		}
		this.wikiService.generateSuggestions(query);
	}
}