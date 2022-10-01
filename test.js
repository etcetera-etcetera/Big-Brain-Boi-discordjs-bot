const Discord = require("discord.js");
const { SlashCommandBuilder } = Discord;
const request = require("request");
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const filesJSON = ["./reddit_jokes.json", "./stupidstuff.json", "./wocka.json"];
// const filesJSON = ["./test.json"];
// for loop all the JSON files and read them using file sync

for (i = 0; i < filesJSON.length; i++) {
  let masterSON = [];
  var readSON = fs.readFileSync(filesJSON[i], "utf8");
  var jokeSON = JSON.parse(readSON);
  // push to masterSON
  masterSON = masterSON.concat(jokeSON);

  for (let i = 0; i < masterSON.length; i++) {
    if (masterSON[i].body.length > 4096) {
      // console.log(masterSON[i].body.length);
      masterSON[i].long = true;
    } else {
      masterSON[i].long = false;
    }
  }

  fs.writeFileSync(filesJSON[i], JSON.stringify(masterSON), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}
