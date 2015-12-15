import { Jsonp } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from 'angular2/core';

export class SearchResult {
	name: string;
	description: string;
	url: string;
}

@Injectable()
export class WikiService {
	baseUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&callback=JSONP_CALLBACK&search=';
	
	suggestions: string[] = [];
	
	constructor(public jsonp: Jsonp) {
		
	}
	
	wikiSearch(query: string): Observable<any> {
		return this.jsonp.request( `${this.baseUrl}${query}` ).map(
			res => res.json()
			);
	}
	
	generateSuggestions(query: string) {
		this.wikiSearch(query)
			.subscribe(
				results => {
					let resSuggests: string[] = results[1];
					this.suggestions = resSuggests.slice();  // We prefer a copy to a reference
				},
				error => console.log(error)
			);
	}
}