const request = require("request");
const dotenv = require("dotenv");
const fs = require("fs");

// Loading the environment variables
dotenv.config();


const json = fs.readFileSync("wocka.json");
const jokes = JSON.parse(json);

for (let i = 0; i < jokes.length; i++) {
  const joke = jokes[i];
  if (!joke.title.length == 0 && !joke.body.length == 0) {
    if (joke.score > 10) {


      (async () => {await db.collection("jokes").add({
        title: joke.title,
        body: joke.body,
      }); })();
      console.log("Added joke");
      
    }
  }
  // db.collection("jokes").add({

}
