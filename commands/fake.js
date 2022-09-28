const Discord = require("discord.js");
const { SlashCommandBuilder } = Discord;

const falso = require("@ngneat/falso");

var commandData = new SlashCommandBuilder()
  .setName("fake")
  .setDescription("Fake or randomise something.")
  .addSubcommand((subcommand) =>
    subcommand.setName("address").setDescription("Fake an address.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("font").setDescription("Fetches a random font.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("programming_lang")
      .setDescription("Fetches a random programming language.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("color")
      .setDescription("Fetches a random color.")
      .addStringOption((option) =>
        option
          .setName("format")
          .setDescription("The format of the color.")
          .setRequired(false)
          .addChoices(
            { name: "Hexadecimal", value: "hex" },
            { name: "RGB", value: "rgb" },
            { name: "HSL", value: "hsl" }
          )
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("brand").setDescription("Fetches a random brand.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("uuid").setDescription("Generates a random UUID.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("json").setDescription("Generates random JSON.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("drink").setDescription("Generates a random drink.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("book").setDescription("Fetches a random book.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("credit_card")
      .setDescription("Generates fake credit card information.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("product").setDescription("Generates random product.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("user").setDescription("Generates random user.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("food").setDescription("Fetches random food.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("number")
      .setDescription("Generates a random 6 digit number.")
      .addIntegerOption((option) =>
        option
          .setName("max")
          .setDescription("The maximum number.")
          .setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("ip").setDescription("Generates a random IP address.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("ipv6")
      .setDescription("Generates a random IPv6 address.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("port").setDescription("Generates a random port.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("slug").setDescription("Generates a random slug.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("url").setDescription("Generates a random URL.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("binary").setDescription("Generates a random binary.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("email").setDescription("Generates a random email.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("name").setDescription("Generates a random name.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("password")
      .setDescription("Generates a random password.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("phone")
      .setDescription("Generates a random phone number.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("username")
      .setDescription("Generates a random username.")
  );

module.exports = {
  data: {
    help: "/fake <subcommand>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    await interaction.deferReply();
    var subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "username":
        var username = falso.randUserName();
        await interaction.editReply("Random username: `" + username + "`");
        break;

      case "phone":
        var phone = falso.randPhoneNumber();
        await interaction.editReply("Random Phone Number: `" + phone + "`");
        break;

      case "password":
        var password = falso.randPassword();
        await interaction.editReply("Random Password: `" + password + "`");
        break;

      case "name":
        var name = falso.randFullName();
        await interaction.editReply("Random Name: `" + name + "`");
        break;

      case "email":
        var email = falso.randEmail();
        await interaction.editReply("Random Email: `" + email + "`");
        break;

      case "address":
        var address = falso.randAddress();
        var addressStr = `Fake Address: \`${address.street}, ${address.city}, ${address.country}\``;
        await interaction.editReply(addressStr);
        break;

      case "font":
        var font = falso.randFontFamily();
        var fontStr = `Random Font: \`${font}\``;
        await interaction.editReply(fontStr);
        break;

      case "programming_lang":
        var lang = falso.randProgrammingLanguage();
        var langStr = `Random Programming Language: \`${lang}\``;
        await interaction.editReply(langStr);
        break;

      case "color":
        var format = interaction.options.getString("format");

        var color;

        switch (format) {
          case "hex":
            color = falso.randHex();
            break;

          case "rgb":
            color = falso.randRgb();
            break;

          case "hsl":
            color = falso.randHsl();
            break;

          default:
            color = falso.randColor();
            break;
        }

        var colorStr = `Random Color: \`${color}\``;
        await interaction.editReply(colorStr);
        break;

      case "brand":
        var brand = falso.randBrand();
        var brandStr = `Random Brand: \`${brand}\``;
        await interaction.editReply(brandStr);
        break;

      case "uuid":
        var uuid = falso.randUuid();
        var uuidStr = `Random UUID: \`${uuid}\``;
        await interaction.editReply(uuidStr);
        break;

      case "json":
        var json = falso.randJSON({ minKeys: 5, maxKeys: 10 });
        var jsonStr = `Random JSON: \`\`\`json\n${JSON.stringify(
          json,
          null,
          4
        )}\n\`\`\``;
        await interaction.editReply(jsonStr);
        break;

      case "drink":
        var drink = falso.randDrinks();
        var drinkStr = `Random Drink: \`${drink}\``;
        await interaction.editReply(drinkStr);
        break;

      case "book":
        var book = falso.randBook();
        console.log(book);

        var bookEmbed = new Discord.EmbedBuilder()
          .setTitle(book.title)
          .setDescription("Category: " + book.category)
          .setAuthor({ name: "Author: " + book.author });

        await interaction.editReply({ embeds: [bookEmbed] });
        break;

      case "credit_card":
        var card = falso.randCreditCard();
        var cardEmbed = new Discord.EmbedBuilder()
          .setTitle("Random Credit Card")
          .addFields(
            {
              name: "Card Number",
              value: card.number.toString(),
              inline: true,
            },
            { name: "Card Type", value: card.type.toString(), inline: true },
            {
              name: "Card Expiry",
              value: card.untilEnd.toString(),
              inline: true,
            },
            { name: "Card CCV", value: card.ccv.toString(), inline: true },
            {
              name: "Card Holder",
              value: card.fullName.toString(),
              inline: true,
            },
            { name: "Account", value: card.account.toString(), inline: true }
          );

        await interaction.editReply({ embeds: [cardEmbed] });
        break;

      case "product":
        var product = falso.randProduct();
        await interaction.editReply("Random Product: `" + product.title + "`");
        break;

      case "user":
        var user = falso.randUser();
        var userEmbed = new Discord.EmbedBuilder()
          .setTitle("Random User")
          .setDescription("ID: " + user.id)
          .addFields(
            {
              name: "Name",
              value: `${user.firstName} ${user.lastName}`,
              inline: true,
            },
            { name: "Username", value: user.username, inline: true },
            { name: "Email", value: user.email, inline: true },
            { name: "Phone", value: user.phone, inline: true },
            {
              name: "Address",
              value: `${user.address.street} ${user.address.city} ${user.address.zipCode}, ${user.address.country}`,
              inline: true,
            }
          );

        await interaction.editReply({ embeds: [userEmbed] });
        break;

      case "food":
        var food = falso.randFood();
        await interaction.editReply("Random Food: `" + food + "`");
        break;

      case "number":
        var max = interaction.options.getInteger("max") || 999999;

        var number = falso.randNumber({ min: 0, max: max });
        await interaction.editReply("Random Number: `" + number + "`");
        break;

      case "ip":
        var ip = falso.randIp();
        await interaction.editReply("Random IP: `" + ip + "`");
        break;

      case "ipv6":
        var ipv6 = falso.randIpv6();
        await interaction.editReply("Random IPv6: `" + ipv6 + "`");
        break;

      case "port":
        var port = falso.randPort();
        await interaction.editReply("Random Port: `" + port + "`");
        break;

      case "slug":
        var slug = falso.randSlug();
        await interaction.editReply("Random Slug: `" + slug + "`");
        break;

      case "url":
        var url = falso.randUrl();
        await interaction.editReply("Random URL: `" + url + "`");
        break;

      case "binary":
        var binary = falso.randBinary();
        await interaction.editReply("Random Binary: `" + binary + "`");
        break;

      default:
        await interaction.editReply("Invalid Option");
        break;
    }
  },
};
