const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

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

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (command === 'play') {
  if (!message.member.voice.channel) {
    return message.reply('Join VC first!');
  }

  const url = args.join(" ");
  if (!url) return message.reply('Give YouTube link');

  const connection = joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator
  });

  const stream = ytdl(url, { filter: 'audioonly' });
  const resource = createAudioResource(stream);

  const player = createAudioPlayer();
  player.play(resource);

  connection.subscribe(player);

  message.reply('Playing 🎶');
  }
  }
});

client.login(process.env.TOKEN);
