const Discord = require("discord.js");
const {SlashCommandBuilder} = Discord;

var commandData = new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Funny?")

async function joke(interaction, jokes) {
  await interaction.reply("funny");
}

module.exports = {
  data: {
    help: "/jokes",
    ...commandData.toJSON()
  },
  async execute(interaction, jokes) {
    await joke(interaction, jokes);
  }
};