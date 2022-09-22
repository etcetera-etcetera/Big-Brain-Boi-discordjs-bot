const request = require("request");
const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("gif")
  .setDescription("Searches Tenor for a GIF.")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("The query to search for")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "/gif <query>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    const query = interaction.options.getString("query");
    var url = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TenorAPIKey}&client_key=BigBrainBoi&limit=1`;
    request(url, async (err, response, body) => {
      const data = JSON.parse(body);
      const gif = data.results[0].media_formats.mediumgif.url;
      await interaction.reply({
        content: gif,
      });
    });
  },
};
