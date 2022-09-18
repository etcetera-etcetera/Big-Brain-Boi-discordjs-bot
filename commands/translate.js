module.exports = {
  data: {
    name: "translate",
    description: "Translate a word or phrase to another language",
    help: "translate <language_from> <language_to> <text>",
    options: [
      {
        name: "language_from",
        description: "The language to translate from",
        type: 3,
        required: true,
      },
      {
        name: "language_to",
        description: "The language to translate to",
        type: 3,
        required: true,
      },
      {
        name: "text",
        description: "The text to translate",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    // const { language_from, language_to, text } = interaction.options;
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
