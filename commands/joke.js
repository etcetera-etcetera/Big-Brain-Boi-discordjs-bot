const Discord = require("discord.js");
const { SlashCommandBuilder } = Discord;
const request = require("request");
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const filesJSON = ["./reddit_jokes.json", "./stupidstuff.json", "./wocka.json"];
// for loop all the JSON files and read them using file sync
var masterSON = [];
let upvotes = " upvotes ";

for (i = 0; i < filesJSON.length; i++) {
  var readSON = fs.readFileSync(filesJSON[i], "utf8");
  var jokeSON = JSON.parse(readSON);
  // push to masterSON
  masterSON = masterSON.concat(jokeSON);
}

var commandData = new SlashCommandBuilder()
  .setName("joke")
  .setDescription("Funny?");

async function joke(interaction) {
  const joke = masterSON[Math.floor(Math.random() * masterSON.length)];

  if (joke.rating) {
    color = "#ff0000";
    title = joke.category;
    body = joke.body;
    footer = { text: joke.rating + "/5  | " + joke.id };
  } else if (joke.score > -1) {
    color = "#ff0000";
    title = joke.title;
    body = joke.body;
    if (joke.score == 1) {
      upvotes = " upvote ";
    }
    console.log(joke.score);
    footer = { text: joke.score + upvotes + " | " + joke.id };
  } else {
    color = "#ff0000";
    title = joke.title;
    body = joke.body;
    console.log(typeof joke.category);
    footer = { text: joke.category + " Joke no. " + joke.id };
  }

  const jokesEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(body)
    .setFooter(footer)
    .setTimestamp();

  interaction.reply({ embeds: [jokesEmbed] });
}

module.exports = {
  data: {
    help: "/jokes",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    await joke(interaction);
  },
};
