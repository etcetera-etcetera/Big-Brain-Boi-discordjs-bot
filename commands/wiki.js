const request = require("request");

module.exports = {
  data: {
    name: "wiki",
    description: "Searches Wikipedia for a page.",
    help: "/wiki <query>",
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
    var url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json`;
    request(url, async (err, response, body) => {
      const data = JSON.parse(body);
      var returnStr = "";

      for (let i = 0; i < 3; i++) {
        const result = data.query.search[i];
        returnStr += `${result.title} - <https://en.wikipedia.org/wiki/${result.title}>\n`;
      }

      await interaction.reply({
        content: returnStr,
      });
    });
  },
};
