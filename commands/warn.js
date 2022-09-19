const Discord = require("discord.js");

module.exports = {
  data: {
    name: "warn",
    description: "Warn a user",
    help: "warn <user> <reason>",
    options: [
      {
        name: "user",
        description: "The user to warn",
        type: 6,
        required: true,
      },
      {
        name: "reason",
        description: "The reason for the warning",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        content: "You do not have permission to use this command!",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const warnEmbed = new Discord.EmbedBuilder()
      .setTitle("You have been warned by " + interaction.user.username)
      .setColor("#ff0000")
      .setDescription(`Reason: ${reason}`)
      .setTimestamp();
    await user.send({ embeds: [warnEmbed] });
    await interaction.reply({
      content: `Successfully warned <@${user.id}>`,
      ephemeral: true,
    });

    await interaction.user.send(
      user.tag +
        ' has been warned for "' +
        reason +
        '" in "' +
        interaction.guild.name +
        '"'
    );
  },
};
