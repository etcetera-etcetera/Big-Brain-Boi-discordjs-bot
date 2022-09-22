const googleIt = require("google-it");
const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("google")
  .setDescription("Searches Google for a query.")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("The query to search for")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "/google <query>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    const query = interaction.options.getString("query");
    googleIt({ query })
      .then(async (results) => {
        var links = "";
        for (let i = 0; i < results.length; i++) {
          links += `${results[i].title} - <${results[i].link}>\n`;
        }

        await interaction.reply({
          content: `Here's what I found: \n${links}`,
        });
      })
      .catch(async () => {
        await interaction.reply({
          content: "An error occurred while searching.",
        });
      });
  },
};
