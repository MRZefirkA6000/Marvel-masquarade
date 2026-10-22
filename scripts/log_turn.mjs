import fs from "fs";
import { callMelty } from "./melty.mjs";

const creatorMsg = fs.readFileSync("public/assets/aistudio/Paste_October_22__2026_-_5_21PM_aa25c7f3", "utf-8");

const replyText = `No mashups combining Marvel Rivals and Vampire: The Masquerade – Bloodlines exist yet on Melty; with Bloodlines as the host and Marvel Rivals as the companion providing hero kits and audio, it is completely safe and ready to publish.

What kind of mashup do you want to play?

1. (Recommended) **Midnight Rivals**: A dark solo action-RPG in Bloodlines where you prowl Santa Monica as Marvel Rivals heroes (Blade, Magik, and Moon Knight), using their authentic weapon animations, sound effects, voice lines, and ultimate powers adapted directly into vampire disciplines and combat arts from the first minute.
2. **Kindred & Champions**: A solo narrative RPG in Bloodlines where Marvel Rivals heroes arrive as supernatural pact companions, street contacts, and Haven ghouls (such as Jeff the Land Shark as a lethal familiar and Cloak & Dagger granting shadow and light wards) to help navigate the LA kindred underworld.
3. **Bloodlines Hero Gauntlet (2-Player Co-op)**: A co-op arena survival mod inside Bloodlines where you and a friend choose Rivals champions to clear increasingly tough vampire factions, blood cultists, and werewolf bosses in downtown LA using shared team-up abilities.

Say go and I'll build the recommended one.`;

async function main() {
  const res = await callMelty("consult_melty", {
    stage: "understanding",
    status: "waiting_on_user",
    blocker: "unclear_design",
    blockerDetail: "Selecting the mashup concept and mechanics",
    creatorMessage: creatorMsg,
    reply: replyText,
    agent: "coding-engine",
    turn: 1,
    workId: "d7f3b18d-d294-48bc-b899-5f9b9120c947"
  });
  console.log(JSON.stringify(res, null, 2));
}

main().catch(console.error);
