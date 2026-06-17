// k4lt-assets.js
import { setupSoundProtection } from "./modules/soundProtection.js";
Hooks.once("ready", () => {
  kultLogger("Initializing k4lt-assets module");
  setupSoundProtection();
});
const FOLLOW_DISTANCE = 0.5;
Hooks.on("updateToken", async (document, change) => {
  if (
    !("x" in change) &&
    !("y" in change) &&
    !("rotation" in change)
  ) {
    return;
  }
  const followerId = document.getFlag(
    "world",
    "follower",
  );
  if (!followerId) return;
  const follower = canvas.scene.tokens.get(
    followerId,
  );
  if (!follower) return;
  const queue = foundry.utils.deepClone(
    document.getFlag(
      "world",
      "followQueue",
    ) ?? [],
  );
  const entry = {
    x: document.x,
    y: document.y,
    rotation: document.rotation,
  };
  const last = queue.at(-1);
  if (
    !last ||
    last.x !== entry.x ||
    last.y !== entry.y ||
    last.rotation !== entry.rotation
  ) {
    queue.push(entry);
  }
  if (queue.length <= FOLLOW_DISTANCE) {
    await document.setFlag(
      "world",
      "followQueue",
      queue,
    );
    return;
  }
  const target = queue.shift();
  await document.setFlag(
    "world",
    "followQueue",
    queue,
  );
  const currentRotation =
    follower.rotation ??
    follower.toObject().rotation ??
    0;
  if (
    follower.x === target.x &&
    follower.y === target.y &&
    currentRotation === target.rotation
  ) {
    return;
  }
  await follower.update({
    x: target.x,
    y: target.y,
    rotation: target.rotation,
  });
});