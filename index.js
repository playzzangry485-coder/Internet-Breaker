const play = require("play-dl");

if (command === 'play') {

  if (!message.member.voice.channel) {
    return message.reply('Join VC first!');
  }

  const query = args.join(" ");

  if (!query) {
    return message.reply('Send song name or link!');
  }

  try {

    // 🔥 Handle both link + search
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

    // 🔥 Important fix (prevents crash)
    player.on("error", (e) => {
      console.error(e);
      message.reply("Error while playing ❌");
    });

    message.reply(`🎶 Now playing!`);

  } catch (err) {
    console.error(err);
    message.reply("Playback failed ❌");
  }
      }
