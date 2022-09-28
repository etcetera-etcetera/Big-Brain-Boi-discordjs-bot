const Discord = require("discord.js");
const request = require("request");
const { Table } = require("embed-table");
const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(process.env.SerpAPI_KEY);
const { EmbedBuilder } = require("discord.js");

const { SlashCommandBuilder } = Discord;

const commandData = new SlashCommandBuilder()
  .setName("football")
  .setDescription("A collection of all football commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("standings")
      .setDescription("Get the standings of teams in a league")
      .addStringOption((option) =>
        option
          .setName("league_id")
          .setDescription("The ID of the league to get standings for")
          .setRequired(true)
      )
  )
  .addSubcommand(
    (subcommand) =>
      subcommand
        .setName("fixtures")
        .setDescription("Get the fixtures of a team in a league")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Just the query")
            .setRequired(true)
        )
    // .addStringOption((option) =>
    //   option
    //     .setName("team_id")
    //     .setDescription("The ID of the team to get fixtures for")
    //     .setRequired(true)
    // )
  );

function standings(interaction) {
  const league_id = interaction.options.getString("league_id");
  var url = `https://api-football-standings.azharimm.dev/leagues/${league_id}/standings?sort=asc`;
  request(url, async (err, response, body) => {
    if (err) {
      console.log(err);
      return;
    }
    var data = JSON.parse(body);
    var standings = data.data.standings;

    var embed = new Discord.EmbedBuilder()
      .setTitle(data.data.name)
      .setColor("#ff0000")
      .setTimestamp();

    try {
      var table = new Table({
        titles: ["Team", "GP", "W", "D", "L", "P", "GF", "GA", "GD"],
        titleIndexes: [0, 30, 34, 38, 43, 50, 57, 62, 68],
        columnIndexes: [0, 16, 19, 22, 25, 28, 32, 36, 40],
        start: "`",
        end: "`",
        padEnd: 5,
      });

      for (var i = 0; i < standings.length; i++) {
        table.addRow([
          `${i + 1}. ${standings[i].team.abbreviation}`,
          standings[i].stats[3].displayValue,
          standings[i].stats[0].displayValue,
          standings[i].stats[2].displayValue,
          standings[i].stats[1].displayValue,
          standings[i].stats[6].displayValue,
          standings[i].stats[4].displayValue,
          standings[i].stats[5].displayValue,
          standings[i].stats[9].displayValue,
        ]);
      }

      embed.addFields(table.field());

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
      interaction.editReply(
        "Something went wrong. Please try this command again later."
      );
    }
  });
}

function fixtures(interaction) {
  const usr_qry = interaction.options.getString("query");

  const params = {
    q: usr_qry,
    location: "austin, texas, united states",
  };

  const callback = function (data) {
    var gLength = data["sports_results"].games.length;
    for (var i = 0; i < gLength; i++) {
      var cLength = data["sports_results"].games[i].teams.length;
      for (var j = 0; j < cLength; j++) {
        console.log(data["sports_results"].games[i].teams[j].name);
      }
    }

    console.log(data["sports_results"].games[1].video_highlights);

    //output in an embed here
    const fixturesEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(data["sports_results"].title)
      .setURL("https://discord.js.org/")
      .setAuthor({
        name: "Some name",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
        url: "https://discord.js.org",
      })
      .setDescription(data["sports_results"].rankings)
      .setThumbnail(data["sports_results"].thumbnail)
      .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true }
      );

    for (let i = 0; i < data["sports_results"].games.length; i++) {
      var games_matches = data["sports_results"].games[i];
      var tournament = games_matches.tournament;
      var team1 = games_matches.teams[0].name;
      var team2 = games_matches.teams[1].name;
      if (games_matches.status != "FT") {
        fixturesEmbed.addFields({
          name: tournament,
          value: team1 + " vs " + team2,
          inline: true,
        });
      } else if (games_matches.status == "FT") {
        fixturesEmbed.addFields({
          name: tournament,
          value: team1 + " vs " + team2,
          inline: false,
        });
      } else {
        fixturesEmbed.addFields({
          name: tournament,
          value: team1 + " vs " + team2,
          inline: true,
        });
      }
    }
    fixturesEmbed
      .addFields({
        name: "Inline field title",
        value: "Some value here",
        inline: true,
      })
      .setImage("https://i.imgur.com/AfFp7pu.png")
      .setTimestamp()
      .setFooter({
        text: "Some footer text here",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
      });

    interaction.editReply({ embeds: [fixturesEmbed] });

    search.json(params, callback);

    // request(url, async (err, response, body) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   var data = JSON.parse(body);
    //   console.log(data)
    // var fixtures = data.data.fixtures;

    // var embed = new Discord.EmbedBuilder()
    //   .setTitle(data.data.name)
    //   .setColor("#ff0000")
    //   .setTimestamp();

    // try {
    //   var table = new Table({
    //     titles: ["Date", "Home", "Away", "Score"],
    //     titleIndexes: [0, 20, 40, 60],
    //     columnIndexes: [0, 10, 30, 50],
    //     start: "`",
    //     end: "`",
    //     padEnd: 5,
    //   });

    //   for (var i = 0; i < fixtures.length; i++) {
    //     table.addRow([
    //       fixtures[i].formattedDate,
    //       fixtures[i].homeTeam.abbreviation,
    //       fixtures[i].awayTeam.abbreviation,
    //       `${fixtures[i].goalsHomeTeam} - ${fixtures[i].goalsAwayTeam}`,
    //     ]);
    //   }

    //   embed.addFields(table.field());

    //   interaction.editReply({ embeds: [embed] });
    // } catch (err) {
    //   console.log(err);
    //   interaction.editReply(
    //     "Something went wrong. Please try this command again later."
    //   );
    // }
    //   });
  };
}

module.exports = {
  data: {
    help: "/football <subcommand>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case "standings":
        standings(interaction);
        break;

      case "fixtures":
        fixtures(interaction);
        break;
    }
  },
};
