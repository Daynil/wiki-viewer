var browser_1 = require('angular2/platform/browser');
var wiki_viewer_1 = require('./wiki-viewer');
browser_1.bootstrap(wiki_viewer_1.WikiViewerComp)
    .then(function (success) { return console.log("bootstrapping success: ", success); }, function (error) { return console.log("bootstrapping error: ", error); });

//# sourceMappingURL=bootstrap.js.map
