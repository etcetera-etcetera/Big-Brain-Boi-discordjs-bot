// FOR DEVELOPMENT PURPOSES ONLY
console.clear();
console.log(
  "------------------------------------------------------------------------------------------------------"
);
// FOR DEVELOPMENT PURPOSES ONLY

// Importing the required modules
const { REST } = require("@discordjs/rest");
const Discord = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Loading the environment variables
dotenv.config();

// Initialising the Discord client
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

// Initialising the Firebase app
initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = getFirestore();

// Initialising the afkUsers array and listener for faster access and realtime updates
var afkUsers = [];

const query = db.collection("afk").where("afk", "==", true);
const observer = query.onSnapshot((querySnapshot) => {
  while (afkUsers.length > 0) {
    afkUsers.pop();
  }
  querySnapshot.forEach((doc) => {
    afkUsers.push({ id: doc.id, ...doc.data() });
  });
});

// Initialising the Discord client
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
  ],
});

// Retrieving required variables from the environment variables
const { token, clientId, guildId } = process.env;

// Retrieving the commands from the commands folder
const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Adding the commands to the commands array
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data);
}

// Initialising the REST client
const rest = new REST({ version: "10" }).setToken(token);

// Registering the application (/) commands
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Discord.Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();

// Listening for the messages to detect if an AFK user is back online
client.on("messageCreate", async (message) => {
  var user = afkUsers.find((user) => user.id === message.author.id);
  if (user) {
    if (user.afk) {
      const embed = new Discord.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("AFK")
        .setDescription(
          "Your AFK status has been removed. You are no longer AFK."
        );
      await db
        .collection("afk")
        .doc(message.author.id)
        .set({ afk: false, message: "" });
      await message.channel.send({ embeds: [embed] });
    }
  }

  var { users } = message.mentions;
  for (const user of users) {
    var afkUser = await afkUsers.find((afkuser) => afkuser.id === user[0]);
    if (afkUser) {
      if (afkUser.afk) {
        message.delete();
        const embed = new Discord.EmbedBuilder()
          .setColor("#0099ff")
          .setTitle("AFK")
          .setDescription(
            `${user[1].tag} is AFK. Their AFK message is: "${afkUser.message}".`
          );
        await message.channel.send({ embeds: [embed] });
        return;
      }
    }
  }
});

// Listening for the interactions to execute the commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Checking if the bot has required permissions for all commands
  if (!interaction.guild.members.me.permissions.has("Administrator")) {
    return interaction.reply({
      content:
        "Please provide me with admin perms to ensure that all commands work as expected.",
    });
  }

  const { commandName } = interaction;

  // Checking if command is /afk for the extra parameter
  if (commandName == "afk") {
    require("./commands/afk.js").execute(interaction, db);
  } else {
    // Running the command
    require(`./commands/${commandName}`).execute(interaction);
  }
});

// Logging in the bot
client.login(token);
