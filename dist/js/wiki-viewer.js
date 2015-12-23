var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var wiki_service_1 = require('./wiki-service');
// Annotation section
var WikiViewerComp = (function () {
    function WikiViewerComp(wikiService) {
        this.wikiService = wikiService;
        this.showingResults = false;
        this.searchClasses = {
            'search-results': this.showingResults,
            'search-noresults': !this.showingResults
        };
    }
    WikiViewerComp.prototype.generateSuggestions = function (query) {
        if (!query) {
            this.wikiService.suggestions = [];
            return;
        }
        this.wikiService.generateSuggestions(query);
    };
    WikiViewerComp.prototype.updateSearch = function (searchBar, suggestion) {
        searchBar.value = suggestion;
        this.showResults(suggestion);
    };
    WikiViewerComp.prototype.showResults = function (query) {
        if (!query)
            return;
        this.wikiService.showResults(query);
    };
    WikiViewerComp.prototype.inputDefocus = function () {
        if (this.wikiService.suggestions)
            this.wikiService.suggestions = [];
    };
    WikiViewerComp.prototype.clearResults = function (searchBar) {
        searchBar.value = '';
        this.wikiService.clearResults();
    };
    WikiViewerComp.prototype.searchPosition = function () {
        this.searchClasses['search-results'] = this.wikiService.showingResults;
        this.searchClasses['search-noresults'] = !this.wikiService.showingResults;
        return this.searchClasses;
    };
    WikiViewerComp = __decorate([
        core_1.Component({
            selector: 'wiki-viewer',
            viewBindings: [wiki_service_1.WikiService]
        }),
        core_1.View({
            templateUrl: '../html/wiki-viewer.html',
            styleUrls: ['../css/wiki-viewer.css']
        }), 
        __metadata('design:paramtypes', [wiki_service_1.WikiService])
    ], WikiViewerComp);
    return WikiViewerComp;
})();
exports.WikiViewerComp = WikiViewerComp;

//# sourceMappingURL=wiki-viewer.js.map
