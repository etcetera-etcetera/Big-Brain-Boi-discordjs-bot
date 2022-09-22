const { SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate a word or phrase to another language.")
  .addStringOption((option) =>
    option
      .setName("language_from")
      .setDescription("The language to translate from.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("language_to")
      .setDescription("The language to translate to")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("The text to translate")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "translate <language_from> <language_to> <text>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    const language_from = interaction.options.getString("language_from");
    const language_to = interaction.options.getString("language_to");
    const text = interaction.options.getString("text");
    const translate = require("@iamtraction/google-translate");
    const translated = await translate(text, {
      from: language_from,
      to: language_to,
    }).catch((err) => {
      console.log(err);
      return interaction.reply({
        content:
          "An error occured while translating the text. Please try again.",
        ephemeral: true,
      });
    });
    await interaction.reply({
      content: `Original: ${text}\nTranslated: ${translated.text}`,
    });
  },
};
