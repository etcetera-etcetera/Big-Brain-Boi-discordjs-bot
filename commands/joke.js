const Discord = require("discord.js");
const { SlashCommandBuilder } = Discord;
const request = require("request");
const fs = require("fs");
const json = fs.readFileSync("./reddit_jokes.json");
const jokeSON = JSON.parse(json);
const { EmbedBuilder } = require("discord.js");

var commandData = new SlashCommandBuilder()
  .setName("joke")
  .setDescription("Funny?");

async function joke(interaction) {
  const joke = jokeSON[Math.floor(Math.random() * jokeSON.length)];
  let title = joke.title;
  let body = joke.body;
  let score = joke.score;
  let id = joke.id;
  let upvotes = " upvotes ";
  if (score == 1) {
    let upvotes = " upvote ";
  }

  const jokesEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setDescription(body)
    .setFooter({
      text: score + upvotes + " | " + id,
    })
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
