import { bootstrap } from 'angular2/platform/browser';
import { CORE_DIRECTIVES } from 'angular2/common';
import { HTTP_PROVIDERS, JSONP_PROVIDERS } from 'angular2/http';
import { WikiViewerComp } from './wiki-viewer';

bootstrap(WikiViewerComp, [HTTP_PROVIDERS, JSONP_PROVIDERS, CORE_DIRECTIVES])
	.then(
		success => console.log("bootstrapping success: ", success),
		error => console.log("bootstrapping error: ",  error)
	);