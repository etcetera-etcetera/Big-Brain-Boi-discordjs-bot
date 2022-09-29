const Fotmob = require('fotmob');
const fotmob = new Fotmob();

(async() => { 
    let matches = await fotmob.getMatchesByDate("20220927");
    let league = await fotmob.getLeague("42", "overview", "league", "Australia/Melbourne");
    let team = await fotmob.getTeam("6017", "overview", "team", "Australia/Melbourne")
    let player = await fotmob.getPlayer("1071179")
    let details = await fotmob.getMatchDetails("3399269")
    console.log(matches)
  })();