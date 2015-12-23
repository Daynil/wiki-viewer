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
	resultBuffer: any;
	results: SearchResult[] = [];
	showingResults = false;
	pendingQuery = false;

	constructor(public jsonp: Jsonp) {
		this.resultStream = this.queryStream
								.debounceTime(250)
								.switchMap( query => this.wikiSearch(query) );
		this.resultStream.subscribe(
				results  => {
					this.resultBuffer = results; // Save the result in case we decide to view results on this query
					let resSuggests: string[] = results[1];
					this.suggestions = resSuggests.slice();  // We prefer a copy to a reference
				},
				error => console.log (error)
			);
	}
	
	wikiSearch(query: string): Rx.Observable<any> {
		return this.jsonp.request( `${this.baseUrl}${query}` ).map( (res: Response) => <any>res.json() );
	}
	
	generateSuggestions(query: string) {
		this.queryStream.next(query);
	}
	
	showResults(query: string) {
		if ( !this.resultBuffer || this.resultBuffer[0] != query ) {
			this.pendingQuery = true;
			this.wikiSearch(query).subscribe( result => {
				this.resultBuffer = result;
				this.parseResults();
			});	
		} else this.parseResults();
	}
	
	parseResults() {
		this.pendingQuery = false;
		this.suggestions = [];
		this.results = [];
		let resultNames = this.resultBuffer[1];
		let resultDescriptions = this.resultBuffer[2];
		let resultUrls = this.resultBuffer[3];
		
		if (resultNames.length < 1) {
            let resultNull = new SearchResult();
            resultNull.name = 'No Results Found!';
            resultNull.description = 'Please try another search term.';
            resultNull.url = '#';
            this.results.push(resultNull);
            this.resultBuffer = null;
            this.showingResults = true;
            return;
        }
		
		for (let i=0; i < resultNames.length; i++) {
			let result = new SearchResult();
			result.name = resultNames[i];
			result.description = resultDescriptions[i];
			result.url = resultUrls[i];
			this.results.push(result);		
		}
		this.resultBuffer = null;
		this.showingResults = true;
	}
	
	clearResults() {
		this.suggestions = [];
		this.results = [];
		this.resultBuffer = null;
		this.showingResults = false;
	}


}