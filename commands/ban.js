const { SlashCommandBuilder } = require("discord.js");

var commandData = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Bans a user from the server.")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to ban").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for the ban")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "/ban <user> [reason]",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");

    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return interaction.reply({
        content: "You don't have permission to ban members.",
      });
    }

    if (!member.bannable) {
      return interaction.reply({
        content: "I can't ban this user.",
      });
    }

    await member.ban({ reason });
    await interaction.reply({
      content: `Banned ${member.user.tag} from the server.`,
    });
  },
};
