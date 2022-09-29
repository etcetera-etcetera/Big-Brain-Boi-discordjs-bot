const request = require("request");
const fs = require("fs");
const json = fs.readFileSync("./reddit_jokes copy.json");
const jokeSON = JSON.parse(json);

for (let i = 0; i < jokeSON.length; i++) {
  const joke = jokeSON[i];
  let title = joke.title;
  let body = joke.body;
  let score = joke.score;
  let id = joke.id;

  console.log(typeof score);
}
