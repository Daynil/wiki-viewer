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
	pendingQuery = false;
	queryQueue: string[] = [];
	
	constructor(public jsonp: Jsonp) {
		
	}
	
	wikiSearch(query: string): Observable<any> {
		this.pendingQuery = true;
		return this.jsonp.request( `${this.baseUrl}${query}` ).map( res => res.json() );
	}
	
	generateSuggestions(query: string) {
		// Only add to the queue if it is empty, and only execute a query if there isn't already a pending one.
		if (this.pendingQuery && this.queryQueue.length > 0) {
			this.queryQueue.pop();
			this.queryQueue.push(query);
			console.log(`Pending query, and we have an old item in queue, clear it and add new one: ${this.queryQueue}.`);
			return; 
		}
		else if (this.pendingQuery && this.queryQueue.length == 0) {
			this.queryQueue.push(query);
			console.log(`Pending query, empty queue, add new query to queue: ${this.queryQueue}`);
			return;
		}
		this.wikiSearch(query)
			.subscribe(
				results => {
					this.pendingQuery = false;
					let resSuggests: string[] = results[1];
					this.suggestions = resSuggests.slice();  // We prefer a copy to a reference
					if (this.queryQueue.length != 0) {
						let chainQuery = this.queryQueue.pop();
						this.generateSuggestions(chainQuery);
						console.log(`We've finished a query and have an item in queue, execute follow up query with: ${chainQuery}.`);
					}
				},
				error => console.log(error)
			);
	}
}