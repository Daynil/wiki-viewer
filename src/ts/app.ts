import { bootstrap } from 'angular2/platform/browser';
import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

// Annotation section
@Component({
	selector: 'my-app'
})
@View({
	template: '<h1>Hello {{ name }}</h1>'
})
// Component controller
class BaseComponent {
	name: string;
	constructor() {
		this.name = 'Alice!';
	}
}


bootstrap(BaseComponent)
	.then(
		success => console.log("bootstrapping success: ", success),
		error => console.log("bootstrapping error: ",  error)
	);