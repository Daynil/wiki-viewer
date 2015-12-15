import { bootstrap } from 'angular2/platform/browser';
import { WikiViewerComp } from './wiki-viewer';

bootstrap(WikiViewerComp)
	.then(
		success => console.log("bootstrapping success: ", success),
		error => console.log("bootstrapping error: ",  error)
	);