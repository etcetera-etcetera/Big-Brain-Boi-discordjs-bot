module.exports = {
  data: {
    name: "unban",
    description: "Unbans a user from the server.",
    help: "/unban <user> [reason]",
    options: [
      {
        name: "user_id",
        description: "The ID of the user to unban.",
        type: 3,
        required: true,
      },
      {
        name: "reason",
        description: "The reason for unbanning the user.",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const member = interaction.options.getString("user_id");
    const reason = interaction.options.getString("reason");

    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return interaction.reply({
        content: "You don't have permission to unban members.",
      });
    }

    await interaction.guild.members
      .unban(member, reason)
      .then((user) => {
        interaction.reply({
          content: `Unbanned ${user.tag} from the server.`,
        });
      })
      .catch(async () => {
        await interaction.reply({
          content: "Please specify a valid banned member's ID.",
        });
      });
  },
};
