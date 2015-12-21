import { Jsonp, Response } from 'angular2/http';
import * as Rx from 'rxjs/Rx';
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
	queryStream = new (<any>Rx).Subject();
	resultStream = new (<any>Rx).Observable();
	pendingQuery = false;
	resultBuffer: any;
	results: SearchResult[] = [];

	constructor(public jsonp: Jsonp) {
		this.resultStream = this.queryStream
								.debounceTime(250)
								.switchMap( query => this.wikiSearch(query) );
		this.resultStream.subscribe(
				results  => {
					this.pendingQuery = false;
					this.resultBuffer = results; // Save the result in case we decide to view results on this query
					let resSuggests: string[] = results[1];
					this.suggestions = resSuggests.slice();  // We prefer a copy to a reference
				},
				error => console.log (error)
			);
	}
	
	wikiSearch(query: string): Rx.Observable<any> {
		this.pendingQuery = true;
		return this.jsonp.request( `${this.baseUrl}${query}` ).map( (res: Response) => <any>res.json() );
	}
	
	generateSuggestions(query: string) {
		this.queryStream.next(query);
	}
	
	showResults() {
		if (!this.pendingQuery && this.resultBuffer) {
			console.log('no pending query');
			this.parseResults();
		}
	}
	
	parseResults() {
		this.suggestions = [];
		this.results = [];
		let resultNames = this.resultBuffer[1];
		let resultDescriptions = this.resultBuffer[2];
		let resultUrls = this.resultBuffer[3];
		
		for (let i=0; i < resultNames.length; i++) {
			let result = new SearchResult();
			result.name = resultNames[i];
			result.description = resultDescriptions[i];
			result.url = resultUrls[i];
			this.results.push(result);		
		}
		this.resultBuffer = null;
	}
	
	clearResults() {
		this.suggestions = [];
		this.results = [];
		this.resultBuffer = null;
	}


}