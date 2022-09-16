module.exports = {
  data: {
    name: "clear",
    description: "Clears messages",
    help: "/clear <number of messages to clear>",
    options: [
      {
        name: "messages",
        description: "Number of messages to clear",
        type: 4,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
      });
    }

    const messages = parseInt(interaction.options.getInteger("messages"));
    let { size } = await interaction.channel.bulkDelete(messages);
    await interaction.reply({
      content: "Deleted " + size + " messages",
    });
  },
};
