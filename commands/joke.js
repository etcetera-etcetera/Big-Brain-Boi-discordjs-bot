const filesJSON = [
  "../reddit_jokes.json",
  "../stupidstuff.json",
  "../wocka.json",
];
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

// for loop all the JSON files and read them using file sync
let upvotes = " upvotes ";
let allJokes = [];

for (i = 0; i < filesJSON.length; i++) {
  var json = require(filesJSON[i]);
  allJokes.push(json);
}

var commandData = new SlashCommandBuilder()
  .setName("joke")
  .setDescription("Funny?");

async function joke(interaction) {
  chance = Math.floor(Math.random() * filesJSON.length);
  var jokes = allJokes[chance];

  var jokeNum = Math.floor(Math.random() * jokes.length);
  const joke = jokes[jokeNum];

  // stupidstuff.json
  if (joke.hasOwnProperty("rating")) {
    color = "#0000ff";
    title = joke.category;
    body = joke.body;
    footer = { text: joke.rating + "/5  | " + joke.id };
  }
  // reddit_jokes.json
  else if (joke.score > -1) {
    color = "#ff4500";
    title = joke.title;
    body = joke.body;
    if (joke.score == 1) {
      upvotes = " upvote ";
    }
    footer = { text: joke.score + upvotes + " | " + joke.id };
  }
  // wocka.json
  else {
    color = "#00ff00";
    title = joke.title;
    body = joke.body;
    footer = { text: joke.category + " Joke no. " + joke.id };
  }

  const jokesEmbed = new EmbedBuilder();

  if (joke.body.length < 4096) {
    jokesEmbed
      .setColor(color)
      .setTitle(title)
      .setDescription(body)
      .setFooter(footer)
      .setTimestamp();

    interaction.reply({ embeds: [jokesEmbed] });
  } else if (joke.body.length > 4096) {
    body1 = joke.body.slice(0, 4096);
    body2 = joke.body.slice(4096, joke.body.length);

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
