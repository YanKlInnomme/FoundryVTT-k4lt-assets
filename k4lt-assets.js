Hooks.once("ready", () => {

  const OriginalSound = foundry.audio.Sound;
  const originalPlay = OriginalSound.prototype.play;

  const protectedPaths = new Set([
    "modules/k4lt-assets/ost/01%20-%20The%20Citadel%20(Kult%20-%20Labyrinth%20Part%20One).mp3",
    "modules/k4lt-assets/ost/02%20-%20The%20Death%20Spiral%20(Kult%20-%20Elysium%20Part%20One).mp3",
    "modules/k4lt-assets/ost/03%20-%20Hangmans%20Bridge%20(Kult%20-%20Elysium%20Part%20Two).mp3",
    "modules/k4lt-assets/ost/04%20-%20Into%20The%20Nothingness%20(Kult%20-%20Elysium%20Part%20Three).mp3",
    "modules/k4lt-assets/ost/05%20-%20The%20Insentient%20(Kult%20-%20Elysium%20Part%20Four).mp3",
    "modules/k4lt-assets/ost/06%20-%20The%20Borderlands%20(Kult%20-%20Labyrinth%20Part%20Two).mp3",
    "modules/k4lt-assets/ost/07%20-%20Machine%20City%20(Kult%20-%20Metropolis%20Part%20One).mp3",
    "modules/k4lt-assets/ost/08%20-%20The%20Sprawl%20(Kult%20-%20Metropolis%20Part%20Two).mp3",
    "modules/k4lt-assets/ost/09%20-%20Inward%2C%20Infinite%20(Kult%20-%20Metropolis%20Part%20Three).mp3",
    "modules/k4lt-assets/ost/10%20-%20Metropolis%20Underground%20(Kult%20-%20Metropolis%20Part%20Four).mp3",
    "modules/k4lt-assets/ost/11%20-%20Purgatory%20(Kult%20-%20Labyrinth%20Part%20Three).mp3",
    "modules/k4lt-assets/ost/12%20-%20Corruption%20Of%20The%20Primordial%20Condition%20(Kult%20-%20Purgatory%20Part%20One).mp3",
    "modules/k4lt-assets/ost/13%20-%20The%20Infinity%20Of%20Solitude%20(Kult%20-%20Purgatory%20Part%20Two).mp3",
    "modules/k4lt-assets/ost/14%20-%20An%20Offer%20You%20Can%27t%20Refuse%20(Kult%20-%20Purgatory%20Part%20Three).mp3",
    "modules/k4lt-assets/ost/15%20-%20Feverishly%20Dreaming%20Of%20Reality%20(Kult%20-%20Purgatory%20Part%20Four).mp3",
    "modules/k4lt-assets/ost/16%20-%20The%20Abyss%20(Kult%20-%20Labyrinth%20Four).mp3",
    "modules/k4lt-assets/ost/17%20-%20Torture%20Room%20(Kult%20-%20Inferno%20Part%20One).mp3",
    "modules/k4lt-assets/ost/18%20-%20Dead%20Sun%2C%20Starless%20Sky%20(Kult%20-%20Inferno%20Part%20Two).mp3",
    "modules/k4lt-assets/ost/19%20-%20Nine%20Halls%20Of%20Hell%20(Kult%20-%20Inferno%20Part%20Three).mp3",
    "modules/k4lt-assets/ost/20%20-%20Astray%20Under%20The%20Archons%20Influence%20(Kult%20-%20Inferno%20Part%20Four).mp3",
    "modules/k4lt-assets/ost/21%20-%20Under%20The%20Dead%20Sun%20(Kult%20-%20Inferno%20Part%20Five).mp3",
    "modules/k4lt-assets/ost/22%20-%20The%20Void%20(Kult%20-%20Labyrinth%20Part%20Five).mp3",
    "modules/k4lt-assets/ost/23%20-%20To%20Sleep%20Is%20Death%2C%20To%20Awaken%20Is%20Hell%20(Kult%20-%20Limbo%20Part%20One).mp3",
    "modules/k4lt-assets/ost/24%20-%20Approach%20To%20Darkness%20(Kult%20-%20Limbo%20Part%20Two%20).mp3",
    "modules/k4lt-assets/ost/25%20-%20A%20Stroll%20Along%20The%20Edge%20Of%20Forever%20(Kult%20-%20Limbo%20Part%20Three).mp3",
    "modules/k4lt-assets/ost/26%20-%20Imperio%20Sanguinis%20(Kult%20-%20Limbo%20Part%20Four).mp3",
    "modules/k4lt-assets/ost/27%20-%20Achlys%20(Kult%20-%20Labyrinth%20Part%20Six).mp3"
  ]);

  OriginalSound.prototype.play = async function (...args) {
    const result = await originalPlay.apply(this, args);

    const path = this.src;

    const match = game.playlists.contents
      .flatMap(p => p.sounds.contents)
      .find(s => path.endsWith(s.path));

    const name = match?.name || game.i18n.localize("k4ltSoundTracker.Unknown");

    kultLogger(`🎵 Playing : ${name} | 📂 ${path}`);

    if (protectedPaths.has(path)) {
      kultLogger(`⏳ Countdown launched for track : ${name}`);
      ui.notifications.warn(game.i18n.localize("k4ltSoundTracker.RestrictedNotice"));

      ChatMessage.create({
        user: game.user.id,
        speaker: { alias: "Sound Tracker" },
        content: game.i18n.format("k4ltSoundTracker.RestrictedChat", { name }),
        whisper: ChatMessage.getWhisperRecipients("GM")
      });

      setTimeout(() => {
        const matches = Array.from(game.audio.playing.values()).filter(s => s.src === path || s.src.endsWith(path));

        if (matches.length === 0) {
          kultLogger("❌ No sound to stop.");
          return;
        }

        for (const s of matches) {
          kultLogger(`🟥 Stop : ${name}`);
          s.stop();
        }

        ChatMessage.create({
          user: game.user.id,
          speaker: { alias: "Sound Tracker" },
          content: game.i18n.format("k4ltSoundTracker.RestrictedEnd", { name }),
          whisper: ChatMessage.getWhisperRecipients("GM")
        });

      }, 29999); // 30 seconds countdown
    }

    return result;
  };
});