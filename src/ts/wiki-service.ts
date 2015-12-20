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
	queryQueue: string[] = [];
	queryStream = new (<any>Rx).Subject();

	constructor(public jsonp: Jsonp) {
		this.queryStream
			.debounceTime(250)
			.switchMap( query => this.wikiSearch(query) )
			.subscribe(
				results  => {
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
}