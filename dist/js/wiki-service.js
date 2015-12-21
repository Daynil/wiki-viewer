var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require('angular2/http');
var Rx = require('rxjs/Rx');
var core_1 = require('angular2/core');
var SearchResult = (function () {
    function SearchResult() {
    }
    return SearchResult;
})();
exports.SearchResult = SearchResult;
var WikiService = (function () {
    function WikiService(jsonp) {
        var _this = this;
        this.jsonp = jsonp;
        this.baseUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&callback=JSONP_CALLBACK&search=';
        this.suggestions = [];
        this.queryStream = new Rx.Subject();
        this.resultStream = new Rx.Observable();
        this.pendingQuery = false;
        this.results = [];
        this.resultStream = this.queryStream
            .debounceTime(250)
            .switchMap(function (query) { return _this.wikiSearch(query); });
        this.resultStream.subscribe(function (results) {
            _this.pendingQuery = false;
            _this.resultBuffer = results; // Save the result in case we decide to view results on this query
            var resSuggests = results[1];
            _this.suggestions = resSuggests.slice(); // We prefer a copy to a reference
        }, function (error) { return console.log(error); });
    }
    WikiService.prototype.wikiSearch = function (query) {
        this.pendingQuery = true;
        return this.jsonp.request("" + this.baseUrl + query).map(function (res) { return res.json(); });
    };
    WikiService.prototype.generateSuggestions = function (query) {
        this.queryStream.next(query);
    };
    WikiService.prototype.showResults = function () {
        if (!this.pendingQuery && this.resultBuffer) {
            console.log('no pending query');
            this.parseResults();
        }
    };
    WikiService.prototype.parseResults = function () {
        this.suggestions = [];
        this.results = [];
        var resultNames = this.resultBuffer[1];
        var resultDescriptions = this.resultBuffer[2];
        var resultUrls = this.resultBuffer[3];
        for (var i = 0; i < resultNames.length; i++) {
            var result = new SearchResult();
            result.name = resultNames[i];
            result.description = resultDescriptions[i];
            result.url = resultUrls[i];
            this.results.push(result);
        }
        this.resultBuffer = null;
    };
    WikiService.prototype.clearResults = function () {
        this.suggestions = [];
        this.results = [];
        this.resultBuffer = null;
    };
    WikiService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Jsonp])
    ], WikiService);
    return WikiService;
})();
exports.WikiService = WikiService;

//# sourceMappingURL=wiki-service.js.map
