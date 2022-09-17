const googleIt = require("google-it");

module.exports = {
  data: {
    name: "google",
    description: "Searches Google for a query.",
    help: "/google <query>",
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
    googleIt({ query })
      .then(async (results) => {
        var links = "";
        for (let i = 0; i < results.length; i++) {
          links += `${results[i].title} - <${results[i].link}>\n`;
        }

        await interaction.reply({
          content: `Here's what I found: \n${links}`,
        });
      })
      .catch(async () => {
        await interaction.reply({
          content: "An error occurred while searching.",
        });
      });
  },
};
