const Discord = require("discord.js");
const request = require("request");
const { SlashCommandBuilder } = require("discord.js");

var commandData = new SlashCommandBuilder()
  .setName("recipies")
  .setDescription("Get a list of recipies")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("What to include in the recipies")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("diet")
      .setDescription("The diet of the recipies")
      .setRequired(true)
      .addChoices(
        { name: "Balanced", value: "balanced" },
        { name: "High Fiber", value: "high-fiber" },
        { name: "High Protein", value: "high-protein" },
        { name: "Low Carb", value: "low-carb" },
        { name: "Low Fat", value: "low-fat" },
        { name: "Low Sodium", value: "low sodium" }
      )
  )
  .addStringOption((option) =>
    option
      .setName("meal_type")
      .setDescription("The meal type of the recipies")
      .setRequired(true)
      .addChoices(
        { name: "Breakfast", value: "breakfast" },
        { name: "Lunch", value: "lunch" },
        { name: "Dinner", value: "dinner" },
        { name: "Snack", value: "snack" },
        { name: "Teatime", value: "teatime" }
      )
  );

module.exports = {
  data: {
    help: "/recipies <query> <diet> <meal_type>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    await interaction.deferReply();
    const query = interaction.options.getString("query");
    const diet = interaction.options.getString("diet");
    const mealType = interaction.options.getString("meal_type");

    let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&?mealType=${mealType}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&diet=${diet}`;
    request(url, async (err, response, body) => {
      if (err) {
        console.log(err);
        return interaction.editReply("Something went wrong");
      }

      const recipies = JSON.parse(body).hits;

      if (recipies.length === 0) {
        return interaction.editReply("No recipies found");
      }

      var embeds = [];

      var limit = recipies.length > 5 ? 5 : recipies.length;

      try {
        for (let i = 0; i < limit; i++) {
          const recipe = recipies[i].recipe;

          const calories = recipe.calories
            ? recipe.calories.toFixed(2).toString()
            : "N/A";

          const totalTime = recipe.totalTime
            ? recipe.totalTime + " mins"
            : "N/A";

          const healthLabels = recipe.healthLabels
            ? recipe.healthLabels.join(", ")
            : "N/A";

          const ingredients = recipe.ingredients
            ? "- " + recipe.ingredientLines.join("\n- ") + "\n\n"
            : "Ingredients: N/A";

          const totalWeight = recipe.totalWeight
            ? recipe.totalWeight.toFixed(2) + "g"
            : "N/A";

          const cautions =
            recipe.cautions.length != 0 ? recipe.cautions.join(", ") : "None";

          const servings = recipe.yield ? recipe.yield.toString() : "N/A";

          const embed = new Discord.EmbedBuilder()
            .setTitle(recipe.label)
            .setURL(recipe.url)
            .setThumbnail(recipe.image)
            .setDescription(ingredients)
            .addFields(
              {
                name: "Calories",
                value: calories,
                inline: true,
              },
              {
                name: "Total Weight",
                value: totalWeight,
                inline: true,
              },
              {
                name: "Total Time",
                value: totalTime,
                inline: true,
              },
              {
                name: "Diet Labels",
                value: recipe.dietLabels.join(", "),
                inline: true,
              },
              {
                name: "Health Labels",
                value: healthLabels,
                inline: true,
              },
              {
                name: "Cautions",
                value: cautions,
                inline: true,
              }
            )
            .setFooter({
              text: `Calories: ${calories} \n\nHealth Labels: ${healthLabels} \n\nServings: ${servings}`,
            });

          embeds.push(embed);
        }
      } catch (err) {
        console.log(err);
        await interaction.editReply("Something went wrong");
      }

      await interaction.editReply({ embeds: embeds });
    });
  },
};
