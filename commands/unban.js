const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("unban")
  .setDescription("Unban a user from the server.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to unban.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for unbanning the user.")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "/unban <user> [reason]",
    ...commandData.toJSON(),
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
