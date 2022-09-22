const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("invite")
  .setDescription("Generates an invite link of the server");

module.exports = {
  data: {
    help: "/invite",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    const invite = await interaction.channel.createInvite({
      maxAge: 0,
      maxUses: 10,
    });

    await interaction.reply({
      content: `Here's an invite link: ${invite}`,
      ephemeral: true,
    });
  },
};
