import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

// Annotation section
@Component({
	selector: 'wiki-viewer'
})
@View({
	templateUrl: '../html/wiki-viewer.html',
	styleUrls: ['../css/wiki-viewer.css']
})
// Component controller
export class WikiViewerComp {

	constructor() {
		
	}
}