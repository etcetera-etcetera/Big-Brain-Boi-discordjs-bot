const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with pong!");

module.exports = {
  data: {
    help: "/ping",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
