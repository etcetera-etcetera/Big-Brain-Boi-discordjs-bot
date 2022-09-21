const Discord = require("discord.js");
const request = require("request");
const { Table } = require("embed-table");

module.exports = {
  data: {
    name: "football_fixtures",
    description: "Shows the current standings for a league.",
    help: "/football_fixtures <league_id>",
    options: [
      {
        name: "league_id",
        description: "The ID of the league to show scores for.",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    await interaction.deferReply();
    const league_id = interaction.options.getString("league_id");
    var url = `https://api-football-standings.azharimm.dev/leagues/${league_id}/standings?sort=asc`;
    request(url, async (err, response, body) => {
      if (err) {
        console.log(err);
        return;
      }
      var data = JSON.parse(body);
      var standings = data.data.standings;
      console.log(standings);

      console.log(standings.length);
      var embed = new Discord.EmbedBuilder()
        .setTitle(data.data.name)
        .setColor("#ff0000")
        .setTimestamp();

      try {
        var table = new Table({
          titles: ["Team", "GP", "W", "D", "L", "P", "GF", "GA", "GD"],
          // titleIndexes: [0, 39, 50, 58, 68, 77, 85, 92, 99],
          // columnIndexes: [0, 16, 22, 27, 33, 38, 45, 50, 54],
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
        interaction.editReply("bruh");
      }
    });
  },
};
