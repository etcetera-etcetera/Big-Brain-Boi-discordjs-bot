const { SlashCommandBuilder } = require('discord.js');

try {
var commandData = new SlashCommandBuilder()
    .setName('recipies')
    .setDescription('Get a list of recipies')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('What to include in the recipies')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('diet')
        .setDescription('The diet of the recipies')
        .setRequired(true)
        .addChoices(
          { name: "Balanced", value: "balanced" },
          { name: "High-Fiber", value: "high-fiber" },
          { name: "High-Protein", value: "high-protein" },
          { name: "Low-Carb", value: "low-carb" },
          { name: "Low-Fat", value: "low-fat" },
          { name: "Low-Sodium", value: "low sodium" }
        )
    )
    .addStringOption(option =>
      option.setName('mealType')
        .setDescription('The meal type of the recipies')
        .setRequired(true)
        .addChoices(
          { name: "Breakfast", value: "breakfast" },
          { name: "Lunch", value: "lunch" },
          { name: "Dinner", value: "dinner" },
          { name: "Snack", value: "snack" },
          { name: "Teatime", value: "teatime" }
        )
    );
        } catch (error) {
            console.error(error);
        }


module.exports = {
  data: {
    help: "/recipies <type> <diet>",
    ...commandData.toJSON()
  },
  async execute(interaction) {
    await interaction.deferReply();
    const query = interaction.options.getString('query');
    const diet = interaction.options.getString('diet');
    const mealType = interaction.options.getString('mealType');

    let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&?mealType=${mealType}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&diet=${diet}`;
    request(url, (err, response, body) => {
      if (err) {
        console.log(err);
        return interaction.editReply("Something went wrong");
      }

      console.log(body);

    })
    await interaction.editReply("Recipies");
  }
};