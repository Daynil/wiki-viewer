var browser_1 = require('angular2/platform/browser');
var common_1 = require('angular2/common');
var http_1 = require('angular2/http');
var wiki_viewer_1 = require('./wiki-viewer');
browser_1.bootstrap(wiki_viewer_1.WikiViewerComp, [http_1.HTTP_PROVIDERS, http_1.JSONP_PROVIDERS, common_1.CORE_DIRECTIVES])
    .then(function (success) { return console.log("bootstrapping success: ", success); }, function (error) { return console.log("bootstrapping error: ", error); });

//# sourceMappingURL=bootstrap.js.map
