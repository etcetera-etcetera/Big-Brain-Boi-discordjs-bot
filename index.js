// FOR DEVELOPMENT PURPOSES ONLY
console.clear();
console.log(
  "------------------------------------------------------------------------------------------------------"
);
// FOR DEVELOPMENT PURPOSES ONLY

const { REST } = require("@discordjs/rest");
const Discord = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

dotenv.config();

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

initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = getFirestore();

const client = new Discord.Client({
  intents: [Discord.GatewayIntentBits.Guilds],
});

const { token, clientId, guildId } = process.env;

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data);
}

const rest = new REST({ version: "10" }).setToken(token);

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (!interaction.guild.members.me.permissions.has("Administrator")) {
    return interaction.reply({
      content:
        "Please provide me with admin perms to ensure that all commands work as expected.",
    });
  }

  const { commandName } = interaction;

  if (commandName) {
    require(`./commands/${commandName}`).execute(interaction);
  }
});

client.login(token);
