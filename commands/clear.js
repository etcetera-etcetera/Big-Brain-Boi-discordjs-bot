const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Clears messages from a channel.")
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("The amount of messages to clear")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "/clear <number of messages to clear>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
      });
    }

    const messages = parseInt(interaction.options.getInteger("messages"));
    let { size } = await interaction.channel.bulkDelete(messages);
    await interaction.reply({
      content: "Deleted " + size + " messages",
    });
  },
};
