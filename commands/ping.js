module.exports = {
  data: {
    name: "ping",
    description: "Replies with pong!",
    help: "/ping",
  },
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
