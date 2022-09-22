const request = require("request");
const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("wiki")
  .setDescription("Searches Wikipedia for a term.")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("The query to search for")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "/wiki <query>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    const query = interaction.options.getString("query");
    var url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json`;
    request(url, async (err, response, body) => {
      const data = JSON.parse(body);
      var returnStr = "";

      for (let i = 0; i < 3; i++) {
        const result = data.query.search[i];
        returnStr += `${
          result.title
        } - <https://en.wikipedia.org/wiki/${result.title
          .split(" ")
          .join("_")}>\n`;
      }

      await interaction.reply({
        content: returnStr,
      });
    });
  },
};
