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
var Subject_1 = require('rxjs/Subject');
require('rxjs/add/operator/map');
require('rxjs/add/operator/debounce');
var core_1 = require('angular2/core');
var SearchResult = (function () {
    function SearchResult() {
    }
    return SearchResult;
})();
exports.SearchResult = SearchResult;
var WikiService = (function () {
    function WikiService(jsonp) {
        this.jsonp = jsonp;
        this.baseUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&callback=JSONP_CALLBACK&search=';
        this.suggestions = [];
        this.pendingQuery = false;
        this.queryQueue = [];
        this.queryStream = new Subject_1.Subject();
    }
    WikiService.prototype.wikiSearch = function (query) {
        this.pendingQuery = true;
        return this.jsonp.request("" + this.baseUrl + query).map(function (res) { return res.json(); });
    };
    WikiService.prototype.generateSuggestions = function (query) {
        var _this = this;
        // Need to figure out how to import onNext and flatMap doesn't work either
        this.queryStream.onNext(query)
            .debounce(500)
            .map(function (query) { return _this.wikiSearch(query)
            .subscribe(function (results) {
            _this.pendingQuery = false;
            var resSuggests = results[1];
            _this.suggestions = resSuggests.slice(); // We prefer a copy to a reference
            if (_this.queryQueue.length != 0) {
                var chainQuery = _this.queryQueue.pop();
                _this.generateSuggestions(chainQuery);
                console.log("We've finished a query and have an item in queue, execute follow up query with: " + chainQuery + ".");
            }
        }, function (error) { return console.log(error); }); });
        return;
        // Only add to the queue if it is empty, and only execute a query if there isn't already a pending one.
        if (this.pendingQuery && this.queryQueue.length > 0) {
            this.queryQueue.pop();
            this.queryQueue.push(query);
            console.log("Pending query, and we have an old item in queue, clear it and add new one: " + this.queryQueue + ".");
            return;
        }
        else if (this.pendingQuery && this.queryQueue.length == 0) {
            this.queryQueue.push(query);
            console.log("Pending query, empty queue, add new query to queue: " + this.queryQueue);
            return;
        }
        this.wikiSearch(query)
            .subscribe(function (results) {
            _this.pendingQuery = false;
            var resSuggests = results[1];
            _this.suggestions = resSuggests.slice(); // We prefer a copy to a reference
            if (_this.queryQueue.length != 0) {
                var chainQuery = _this.queryQueue.pop();
                _this.generateSuggestions(chainQuery);
                console.log("We've finished a query and have an item in queue, execute follow up query with: " + chainQuery + ".");
            }
        }, function (error) { return console.log(error); });
    };
    WikiService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Jsonp])
    ], WikiService);
    return WikiService;
})();
exports.WikiService = WikiService;

//# sourceMappingURL=wiki-service.js.map
