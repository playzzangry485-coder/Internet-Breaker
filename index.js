const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const play = require("play-dl");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = ".";

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ✅ IMPORTANT: async here
client.on('messageCreate', async (message) => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (command === 'play') {

    if (!message.member.voice.channel) {
      return message.reply('Join VC first!');
    }

    const query = args.join(" ");

    if (!query) {
      return message.reply('Send song name or link!');
    }

    try {
      let url;

      if (play.yt_validate(query) === "video") {
        url = query;
      } else {
        const result = await play.search(query, { limit: 1 });
        if (!result.length) return message.reply("No results found!");
        url = result[0].url;
      }

      const stream = await play.stream(url);

      const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();

      const resource = createAudioResource(stream.stream, {
        inputType: stream.type
      });

      player.play(resource);
      connection.subscribe(player);

      player.on("error", (e) => {
        console.error(e);
        message.reply("Error while playing ❌");
      });

      message.reply("🎶 Now playing!");

    } catch (err) {
      console.error(err);
      message.reply("Playback failed ❌");
    }
  }

});

client.login("YOUR_BOT_TOKEN");
