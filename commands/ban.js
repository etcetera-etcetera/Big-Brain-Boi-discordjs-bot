module.exports = {
  data: {
    name: "ban",
    description: "Bans a user from the server.",
    help: "/ban <user> [reason]",
    options: [
      {
        name: "user",
        description: "The user to ban.",
        type: 6,
        required: true,
      },
      {
        name: "reason",
        description: "The reason for banning the user.",
        type: 3,
        required: true,
      },
    ],
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
