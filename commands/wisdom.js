const { SlashCommandBuilder } = require("discord.js");
const falso = require("@ngneat/falso");

var commandData = new SlashCommandBuilder()
  .setName("wisdom")
  .setDescription("Fetches a random quote.");

module.exports = {
  data: {
    help: "/wisdom",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    var quote = await falso.randQuote();
    await interaction.reply("```" + quote + "```");
  },
};
