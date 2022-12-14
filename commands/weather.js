const Discord = require("discord.js");
const { SlashCommandBuilder } = Discord;

const commandData = new SlashCommandBuilder()
  .setName("weather")
  .setDescription("Get the weather of a location.")
  .addStringOption((option) =>
    option
      .setName("location")
      .setDescription("The location to get the weather of.")
      .setRequired(true)
  );

async function getWeather(location, interaction) {
  const response = await fetch(`https://wttr.in/${location}?format=j1`).catch(
    async (err) => {
      console.error(err);
      await interaction.reply({
        content:
          "There was an error while getting weather data! Please try again later.",
        ephemeral: true,
      });
      return false;
    }
  );
  const json = await response.json();
  return json;
}

module.exports = {
  data: {
    help: "/weather <location>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    await interaction.deferReply();
    const location = interaction.options.getString("location");
    const weather = await getWeather(location, interaction);
    if (weather === false) return;
    const embed = new Discord.EmbedBuilder()
      .setTitle(
        `Weather for ${weather.nearest_area[0].areaName[0].value}, ${weather.nearest_area[0].region[0].value}`
      )
      .setDescription(weather.current_condition[0].weatherDesc[0].value)
      .addFields([
        {
          name: "Temperature",
          value: `${weather.current_condition[0].temp_C}°C / ${weather.current_condition[0].temp_F}°F`,
          inline: true,
        },
        {
          name: "Feels Like",
          value: `${weather.current_condition[0].FeelsLikeC}°C / ${weather.current_condition[0].FeelsLikeF}°F`,
          inline: true,
        },
        {
          name: "Humidity",
          value: `${weather.current_condition[0].humidity}%`,
          inline: true,
        },
        {
          name: "Wind",
          value: `${weather.current_condition[0].windspeedKmph}km/h ${weather.current_condition[0].winddir16Point}`,
          inline: true,
        },
        {
          name: "Cloud Cover",
          value: `${weather.current_condition[0].cloudcover}%`,
          inline: true,
        },
        {
          name: "Observation Time",
          value: weather.current_condition[0].observation_time,
          inline: true,
        },
      ]);
    await interaction.editReply({ embeds: [embed] });
  },
};
