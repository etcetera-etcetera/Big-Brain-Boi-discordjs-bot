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

    const logEmbed = new Discord.EmbedBuilder()
      .setTitle("User Warned")
      .setColor("#ff0000")
      .setDescription(
        `**User:** <@${user.id}>\n**Moderator:** <@${interaction.user.id}>\n**Reason:** ${reason}`
      )
      .setTimestamp();

    var checkLogChannel = await interaction.guild.channels
      .fetch()
      .then((channels) =>
        channels.find((channel) => channel.name === "mod-logs")
      );

    if (!checkLogChannel) {
      interaction.guild.channels.create({
        name: "mod-logs",
        type: 0,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [Discord.PermissionFlagsBits.ViewChannel],
          },
        ],
      });
    }

    var logChannel = await interaction.guild.channels
      .fetch()
      .then((channels) =>
        channels.find((channel) => channel.name === "mod-logs")
      );
    await logChannel.send({ embeds: [logEmbed] });

    const DMEmbed = new Discord.EmbedBuilder()
      .setTitle("Warned " + user.tag)
      .setColor("#ff0000")
      .setDescription(`Reason: ${reason}`)
      .setTimestamp();

    await interaction.user.send({ embeds: [DMEmbed] });

    await interaction.reply({
      content: `Successfully warned <@${user.id}>`,
      ephemeral: true,
    });
  },
};
