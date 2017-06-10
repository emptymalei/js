'use strict';

console.clear(' ');

/*
 * NOTE: im using babel to generate my code back to the older js, that's why I'm using ES6
 *
 * Steps
 * 1. make http request
 * 2. save results in callback as a observable
 * 3. map or flatMap the observable (optional)
 * 4. subscribe to the map (or observable)
 */



var app = new Vue({
	el: '#app',
	data: {
		// this is where the result gets stored in
		// right now it's false, that way I can check if the page is done loading
		feed: [],
		timer: '',
		items: ['a','b','c'],
		ids: ['Georg.G.Raffelt.1','Huaiyu.Duan.1']
	},

	// execute on dom loading
	mounted: function mounted() {
		var _this = this;


		for(var i=0; i< _this.ids.length; i++) {
			var names = _this.ids[i];
			this.feedPromise(function (result) {
				result.flatMap(function (val) {
					return Rx.Observable.of(val.body);
				}).subscribe(function (result) {
					console.log(' ');
					console.info('subscribing to results');
					console.log(i);
					console.log( names );
					_this.feed.push(
						result.slice(0,2)
					);
				}, function (err) {
					throw err;
				}, function () {
					console.log(' ');
					console.log('DONE!');
					console.log(' ');
					console.log('This is what you got..');
					console.log(' ');
				});
			}, _this.ids[i]);
		}
	},

	methods: {
		feedPromise: function feedPromise(cb, id) {
			// save a promise
			console.log(' ');
			console.info('sending http req');

			var promise = this.$http.get('http://inspirehep.net/search?p=exactauthor%3A' + id +'&sf=earliestdate&of=recjson&ot=recid,creation_date,authors,abstract,primary_report_number,publication_info');

			promise.then(function (result) {
				// save promise inside callback
				console.info('Got results back');

				cb(Rx.Observable.from([result]));
			});
		}
	}
});
