const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kicks a user from the server.")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to kick").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for the kick")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "/kick <user> [reason]",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");

    if (!interaction.member.permissions.has("KICK_MEMBERS")) {
      return interaction.reply({
        content: "You don't have permission to kick members.",
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: "I can't kick this user.",
      });
    }

    await member.kick(reason);
    await interaction.reply({
      content: `Kicked ${member.user.tag} from the server.`,
    });
  },
};
