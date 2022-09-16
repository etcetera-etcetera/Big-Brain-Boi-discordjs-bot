module.exports = {
  data: {
    name: "kick",
    description: "Kicks a user from the server.",
    help: "/kick <user> [reason]",
    options: [
      {
        name: "user",
        description: "The user to kick.",
        type: 6,
        required: true,
      },
      {
        name: "reason",
        description: "The reason for kicking the user.",
        type: 3,
        required: false,
      },
    ],
  },
  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");

    if (!interaction.member.permissions.has("KICK_MEMBERS")) {
      return interaction.reply({
        content: "I don't have permission to kick members.",
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
