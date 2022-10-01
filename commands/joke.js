const Discord = require("discord.js");
const filesJSON = [
  "../reddit_jokes.json",
  "../stupidstuff.json",
  "../wocka.json",
];
const {
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
  try {
    var chance = Math.floor(Math.random() * filesJSON.length);
    var jokes = allJokes[chance];

    var jokeNum = Math.floor(Math.random() * jokes.length);
    const joke = jokes[jokeNum];

    var color, body, title, category;

    // stupidstuff.json
    if (joke.hasOwnProperty("rating")) {
      color = 0x0000ff;
      title = joke.category ? joke.category : "";
      body = joke.body ? joke.body : "";
      footer = { text: joke.rating + "/5  | " + joke.id };
    }
    // reddit_jokes.json
    else if (joke.score > -1) {
      color = 0xff4500;
      title = joke.title;
      body = joke.body;
      if (joke.score == 1) {
        upvotes = " upvote ";
      }
      footer = { text: joke.score + upvotes + " | " + joke.id };
    }
    // wocka.json
    else {
      color = 0x00ff00;
      title = joke.title;
      body = joke.body;
      category = joke.category ? joke.category : "";
      footer = { text: category + " Joke no. " + joke.id };
    }

    var jokesEmbed;

    if (joke.body.length < 4096) {
      jokesEmbed = {
        color: color,
        title: title,
        description: body,
        footer: footer,
        timestamp: new Date().toISOString(),
      };

      interaction.reply({ embeds: [jokesEmbed] });
    } else if (joke.body.length > 4096) {
      body1 = joke.body.slice(0, 4096);
      body2 = joke.body.slice(4096, joke.body.length);

      jokesEmbed = {
        color: color,
        title: title,
        description: body1,
      };

      var page2 = {
        color: color,
        description: body2,
        footer: footer,
        timestamp: new Date().toISOString(),
      };

      var embeds = [jokesEmbed, page2];

      var getRow = (pageNum) => {
        const row = new Discord.ActionRowBuilder();

        row.addComponents(
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Continue Reading...")
            .setStyle(ButtonStyle.Primary)
        );

        return row;
      };

      let pageNum = 0;
      var embed = embeds[pageNum];

      await interaction.reply({
        embeds: [embed],
        components: [getRow(pageNum)],
      });

      let collector = interaction.channel.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id, // only collect from the command user
        time: 40000, // 40 seconds
      });

      collector.on("collect", async (btnInt) => {
        try {
          if (!btnInt) return;

          await btnInt.deferUpdate();

          if (btnInt.customId === "next") {
            await btnInt.editReply({
              embeds: [...embeds],
              components: [],
            });

            collector = "";
          }
        } catch (err) {
          // Ignore errors
        }
      });
    } else {
      interaction.reply({ content: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    await interaction.reply({ content: "Something went wrong2" });
  }
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
