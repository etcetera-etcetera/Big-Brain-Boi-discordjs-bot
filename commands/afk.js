const Discord = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

var commandData = new SlashCommandBuilder()
  .setName("afk")
  .setDescription("Set your AFK status")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The message you want someone to see if they ping you.")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "/afk <message>",
    ...commandData,
  },
  async execute(interaction, db) {
    await interaction.deferReply({
      ephemeral: true,
    });

    const message = interaction.options.getString("message");

    const userRef = db.collection("afk").doc(interaction.user.id);
    await userRef.set({
      afk: true,
      message,
    });

    const embed = new Discord.EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("AFK")
      .setDescription(
        `You are now AFK in this server. Your AFK message is: ${message}`
      );
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  },
};
