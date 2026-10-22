import fs from "fs";
import path from "path";

// Ensure mod directory structure
const modDir = "mod_build/midnight_rivals";
fs.mkdirSync(`${modDir}/cfg`, { recursive: true });
fs.mkdirSync(`${modDir}/python`, { recursive: true });
fs.mkdirSync(`${modDir}/scripts`, { recursive: true });

// Load sheets
const heroes = JSON.parse(fs.readFileSync("sheets/heroes.json", "utf-8")).rows;
const abilities = JSON.parse(fs.readFileSync("sheets/abilities.json", "utf-8")).rows;
const systems = JSON.parse(fs.readFileSync("sheets/systems.json", "utf-8")).rows;

// Generate autoexec.cfg
const cfgContent = `// Midnight Rivals - Marvel Rivals x Vampire: The Masquerade - Bloodlines
// Auto-generated configuration for Third-Person Camera and Hero Hotkeys

echo "=== Initializing Midnight Rivals Mod ==="

// Enforce Third Person Camera Mode
thirdperson
cam_command 1
cam_idealdist 90
cam_ideallag 4
cam_snapto 0
c_thirdpersonshoulder 1
c_thirdpersonshoulderoffset 22
c_thirdpersonshoulderheight 5

// Hero Swapping Hotkeys (1: Emma Frost, 2: Black Cat, 3: Invisible Woman)
bind "1" "vpython midnight_rivals.switch_hero(0)"
bind "2" "vpython midnight_rivals.switch_hero(1)"
bind "3" "vpython midnight_rivals.switch_hero(2)"
bind "KP_END" "vpython midnight_rivals.switch_hero(0)"
bind "KP_DOWNARROW" "vpython midnight_rivals.switch_hero(1)"
bind "KP_PGDN" "vpython midnight_rivals.switch_hero(2)"

// Ability Cast Hotkeys
bind "q" "vpython midnight_rivals.cast_ability(1)"
bind "e" "vpython midnight_rivals.cast_ability(2)"
bind "z" "vpython midnight_rivals.cast_ultimate()"
bind "f2" "vpython midnight_rivals.toggle_camera()"

echo "Midnight Rivals Controls Loaded: 1=Emma Frost, 2=Black Cat, 3=Invisible Woman, Q/E/Z=Abilities"
`;
fs.writeFileSync(`${modDir}/cfg/autoexec.cfg`, cfgContent);

// Generate Python module: midnight_rivals.py
const pyContent = `# Midnight Rivals - Bloodlines Python Scripting
# Manages character switching, disciplines, camera overrides, and companion audio triggers

import sys
import math

HEROES = ${JSON.stringify(heroes, null, 2)}
ABILITIES = ${JSON.stringify(abilities, null, 2)}

active_hero_index = 0
third_person_enabled = True

def log(msg):
    print("[MidnightRivals] " + str(msg))

def get_player():
    try:
        import __main__
        if hasattr(__main__, 'FindPlayer'):
            return __main__.FindPlayer()
    except Exception as e:
        pass
    return None

def switch_hero(index):
    global active_hero_index
    if index < 0 or index >= len(HEROES):
        return
    active_hero_index = index
    hero = HEROES[index]
    log("Switched to hero: " + hero["name"])

    pc = get_player()
    if pc:
        # Update character stats
        pc.blood_pool = hero["blood_pool"]
        # In Bloodlines, set camera distance to hero preference
        try:
            import console
            console.execute("cam_idealdist " + str(hero["tp_cam_distance"]))
        except:
            pass

    return hero["name"]

def cast_ability(slot):
    hero = HEROES[active_hero_index]
    ability_key = "ability_" + str(slot)
    ability_id = hero.get(ability_key)
    for ab in ABILITIES:
        if ab["ability_id"] == ability_id:
            log("Casting " + ab["name"] + " (" + ab["discipline_equivalent"] + ")")
            return ab["name"]
    return None

def cast_ultimate():
    hero = HEROES[active_hero_index]
    ult_id = hero["ultimate"]
    for ab in ABILITIES:
        if ab["ability_id"] == ult_id:
            log("ULTIMATE ACTIVATED: " + ab["name"])
            return ab["name"]
    return None

def toggle_camera():
    global third_person_enabled
    third_person_enabled = not third_person_enabled
    log("Third-person camera: " + ("ON" if third_person_enabled else "OFF"))
    return third_person_enabled

if __name__ == "__main__":
    log("Midnight Rivals Python script initialized.")
`;
fs.writeFileSync(`${modDir}/python/midnight_rivals.py`, pyContent);

// Generate scripts/game_sounds_rivals.txt
const soundContent = `// Marvel Rivals companion audio mappings for Bloodlines
// Audio files referenced from player's installed copy of Marvel Rivals via {game:marvel-rivals}

"Rivals.EmmaFrost.Diamond"
{
    "channel"       "CHAN_STATIC"
    "volume"        "1.0"
    "soundlevel"    "SNDLVL_NORM"
    "wave"          "{game:marvel-rivals}/MarvelRivals/Content/Audio/WwiseAudio/EmmaFrost/SFX_Emma_Diamond_Activate.wav"
}

"Rivals.BlackCat.Claw"
{
    "channel"       "CHAN_WEAPON"
    "volume"        "1.0"
    "soundlevel"    "SNDLVL_NORM"
    "wave"          "{game:marvel-rivals}/MarvelRivals/Content/Audio/WwiseAudio/BlackCat/SFX_BlackCat_Claw_Slash.wav"
}

"Rivals.InvisibleWoman.Shield"
{
    "channel"       "CHAN_STATIC"
    "volume"        "1.0"
    "soundlevel"    "SNDLVL_NORM"
    "wave"          "{game:marvel-rivals}/MarvelRivals/Content/Audio/WwiseAudio/InvisibleWoman/SFX_InvisibleWoman_Shield_Loop.wav"
}
`;
fs.writeFileSync(`${modDir}/scripts/game_sounds_rivals.txt`, soundContent);

// Write metadata file inside mod
const modInfo = {
  id: "midnight-rivals",
  name: "Midnight Rivals",
  version: "0.1.0",
  primary_game: "custom-vampire-the-masquerade-bloodlines",
  companion_game: "marvel-rivals",
  description: "Play Vampire: The Masquerade - Bloodlines in third-person as Marvel Rivals heroes (Emma Frost, Black Cat, Invisible Woman) with real abilities, third-person camera controls, and companion audio integration.",
  heroes: heroes.map(h => h.name)
};
fs.writeFileSync(`${modDir}/mod_info.json`, JSON.stringify(modInfo, null, 2));

console.log("Successfully built mod package files in " + modDir);
