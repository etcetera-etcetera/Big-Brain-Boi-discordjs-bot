const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  data: {
    name: "help",
    description: "Shows a list of commands.",
    help: "/help",
  },
  async execute(interaction) {
    await interaction.reply(
      "Here's a list of commands: https://bigbrainboi.netlify.app/help"
    );
  },
};
