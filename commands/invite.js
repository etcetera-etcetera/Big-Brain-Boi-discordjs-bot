module.exports = {
  data: {
    name: "invite",
    description: "Generates an invite link.",
    help: "/invite",
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
