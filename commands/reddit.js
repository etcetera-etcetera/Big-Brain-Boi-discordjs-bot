const Discord = require("discord.js");
const { SlashCommandBuilder } = Discord;

var commandData = new SlashCommandBuilder()
  .setName("reddit")
  .setDescription("Get a random post from a subreddit")
  .addStringOption((option) =>
    option
      .setName("subreddit")
      .setDescription("The subreddit to get a post from")
      .setRequired(true)
  );

module.exports = {
  data: {
    help: "/reddit <subreddiit>",
    ...commandData.toJSON(),
  },
  async execute(interaction) {
    var subreddit = interaction.options.getString("subreddit");
    var res = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
    var subreddit = await res.json();

    try {
      if (!subreddit.data || subreddit.data.children.length === 0) {
        return interaction.reply({
          content: "No posts found",
          ephemeral: true,
        });
      }

      var posts = [];
      subreddit.data.children.forEach((post) => {
        post.data.url ? posts.push(post) : null;
      });
      posts.shift();

      var numOfPosts = posts.length;
      var randInt = Math.floor(Math.random() * numOfPosts);
      var post = posts[randInt].data;

      var embed = new Discord.EmbedBuilder()
        .setTitle(post.title)
        .setURL(`https://reddit.com${post.permalink}`)
        .setImage(post.url)
        .setFooter({ text: `👍 ${post.ups} | 💬 ${post.num_comments}` });

      post.selftext.length > 0 ? embed.setDescription(post.selftext) : null;

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
      interaction.reply({
        content: "Something went wrong",
        ephemeral: true,
      });
    }
  },
};
