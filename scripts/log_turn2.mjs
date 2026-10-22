import { callMelty } from "./melty.mjs";

const creatorMsg = `1 вариант лучше всех. Смотри персонажей добавь 3 добавь трёх персонажей с возможностью меняться между ними, а именно эмму фрост, чёрную кошкуи женщину неведимку.  камера должна быть от третьего лица.`;

const replyText = `The first playable version of Midnight Rivals includes third-person over-the-shoulder camera play in Bloodlines with instant on-the-fly switching (hotkeys 1–3) between Emma Frost, Black Cat, and Invisible Woman, along with their adapted Marvel Rivals powers, cooldowns, and companion audio.

How would you like the mashup licensed and may others remix it (I recommend the MIT license with remixing allowed)?`;

async function main() {
  const res = await callMelty("consult_melty", {
    stage: "building",
    status: "waiting_on_user",
    blocker: "none",
    creatorMessage: creatorMsg,
    reply: replyText,
    agent: "coding-engine",
    turn: 2,
    workId: "d7f3b18d-d294-48bc-b899-5f9b9120c947"
  });
  console.log(JSON.stringify(res, null, 2));
}

main().catch(console.error);
