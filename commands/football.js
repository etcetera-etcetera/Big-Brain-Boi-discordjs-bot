const Discord = require("discord.js");
const request = require("request");
const { Table } = require("embed-table");

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
  .addSubcommand((subcommand) =>
    subcommand
      .setName("fixtures")
      .setDescription("Get the fixtures of a team in a league")
      .addStringOption((option) =>
        option
          .setName("league_id")
          .setDescription("The ID of the league to get fixtures for")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("team_id")
          .setDescription("The ID of the team to get fixtures for")
          .setRequired(true)
      )
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
  const league_id = interaction.options.getString("league_id");
  const team_id = interaction.options.getString("team_id");
  var url = `https://api-football-standings.azharimm.dev/leagues/${league_id}/teams/${team_id}/fixtures?sort=asc`;
  request(url, async (err, response, body) => {
    if (err) {
      console.log(err);
      return;
    }
    var data = JSON.parse(body);
    console.log(data)
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
  });
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
