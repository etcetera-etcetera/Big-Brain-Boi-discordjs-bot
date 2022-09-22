const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows a list of commands.");

module.exports = {
  data: {
    help: "/help",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    await interaction.reply(
      "Here's a list of commands: https://bigbrainboi.netlify.app/help"
    );
  },
};
