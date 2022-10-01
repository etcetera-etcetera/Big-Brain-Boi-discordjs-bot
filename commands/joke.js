const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const filesJSON = ["./reddit_jokes.json", "./stupidstuff.json", "./wocka.json"];
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");

// for loop all the JSON files and read them using file sync
var masterSON = [];
let upvotes = " upvotes ";
let arrLength = [];
let jokErr = [];

for (i = 0; i < filesJSON.length; i++) {
  var readSON = fs.readFileSync(filesJSON[i], "utf8");
  var jokeSON = JSON.parse(readSON);
  arrLength.push(jokeSON.length);
  // push to masterSON
  // masterSON = masterSON.concat(jokeSON);
  jokErr.push(jokeSON);
}

var commandData = new SlashCommandBuilder()
  .setName("joke")
  .setDescription("Funny?");

async function joke(interaction) {
  chance = Math.floor(Math.random() * 3);
  if (chance == 0) {
    var masterSON = jokErr[0];
  } else if (chance == 1) {
    var masterSON = jokErr[1];
  } else {
    var masterSON = jokErr[2];
  }
  numeroRandomo = Math.floor(Math.random() * masterSON.length);
  const jokeEnt = masterSON[numeroRandomo];
  // Stupid Stuff
  if (jokeEnt.hasOwnProperty("rating")) {
    color = "#0000ff";
    title = jokeEnt.category;
    body = jokeEnt.body;
    footer = { text: jokeEnt.rating + "/5  | " + jokeEnt.id };
  } // Reddit Jokes
  else if (jokeEnt.score > -1) {
    color = "#ff4500";
    title = jokeEnt.title;
    body = jokeEnt.body;
    if (jokeEnt.score == 1) {
      upvotes = " upvote ";
    }
    footer = { text: jokeEnt.score + upvotes + " | " + jokeEnt.id };
  } // Wocka
  else {
    color = "#00ff00";
    title = jokeEnt.title;
    body = jokeEnt.body;
    footer = { text: jokeEnt.category + " Joke no. " + jokeEnt.id };
  }

  const jokesEmbed = new EmbedBuilder();

  if (jokeEnt.body.length < 4096) {
    jokesEmbed
      .setColor(color)
      .setTitle(title)
      .setDescription(body)
      .setFooter(footer)
      .setTimestamp();

    interaction.reply({ embeds: [jokesEmbed] });
  } else if (jokeEnt.body.length > 4096) {
    body1 = jokeEnt.body.slice(0, 4096);
    body2 = jokeEnt.body.slice(4096, jokeEnt.body.length);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("primary")
        .setLabel("Coninue Reading...")
        .setStyle(ButtonStyle.Primary)
    );

    jokesEmbed.setColor(color).setTitle(title).setDescription(body1);

    await interaction.reply({
      content: "Read More",
      embeds: [jokesEmbed],
      components: [row],
    });
  } else {
    interaction.reply({ content: "Something went wrong" });
  }
}

async function sendFull(interaction) {
  const jokesEmbed2 = new EmbedBuilder();
  jokesEmbed2
    .setColor(color)
    .setDescription(body2)
    .setFooter(footer)
    .setTimestamp();
  await interaction.reply({ embeds: [jokesEmbed2] });
}

module.exports = {
  data: {
    help: "/jokes",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    await joke(interaction);
  },
  async implement(interaction) {
    await sendFull(interaction);
  },
};
