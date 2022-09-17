const request = require("request");

module.exports = {
  data: {
    name: "gif",
    description: "Searches Tenor for a GIF.",
    help: "/gif <query>",
    options: [
      {
        name: "query",
        description: "The query to search for.",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const query = interaction.options.getString("query");
    var url = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TenorAPIKey}&client_key=BigBrainBoi&limit=1`;
    request(url, async (err, response, body) => {
      const data = JSON.parse(body);
      const gif = data.results[0].media_formats.mediumgif.url;
      await interaction.reply({
        content: gif,
      });
    });
  },
};
