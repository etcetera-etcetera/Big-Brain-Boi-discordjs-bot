const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("SerpAPI KEY");

const params = {
  q: "parissaint germain",
  location: "austin, texas, united states"
};

const callback = function(data) {
    
    var gLength = data["sports_results"].games.length
    for (var i = 0; i < gLength; i++) {
        var cLength = data["sports_results"].games[i].teams.length
    for (var j = 0; j < cLength; j++) {
        console.log(data["sports_results"].games[i].teams[j].name)
    }
    };
}
// Show result as JSON
search.json(params, callback);
