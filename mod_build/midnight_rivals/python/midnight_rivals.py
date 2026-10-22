# Midnight Rivals - Bloodlines Python Scripting
# Manages character switching, disciplines, camera overrides, and companion audio triggers

import sys
import math

HEROES = [
  {
    "hero_id": "emma_frost",
    "name": "Emma Frost",
    "role": "Vanguard / Mentalist",
    "base_health": 150,
    "blood_pool": 15,
    "passive": "Diamond Hardness",
    "ability_1": "diamond_form",
    "ability_2": "psychic_blast",
    "ultimate": "mind_wipe",
    "tp_cam_distance": 90,
    "rivals_asset_bank": "MarvelRivals/Content/Audio/WwiseAudio/EmmaFrost"
  },
  {
    "hero_id": "black_cat",
    "name": "Black Cat (Felicia Hardy)",
    "role": "Duelist / Infiltrator",
    "base_health": 110,
    "blood_pool": 12,
    "passive": "Nine Lives Fortune",
    "ability_1": "grapple_leap",
    "ability_2": "shadow_claws",
    "ultimate": "bad_luck_curse",
    "tp_cam_distance": 85,
    "rivals_asset_bank": "MarvelRivals/Content/Audio/WwiseAudio/BlackCat"
  },
  {
    "hero_id": "invisible_woman",
    "name": "Invisible Woman (Sue Storm)",
    "role": "Strategist / Protector",
    "base_health": 120,
    "blood_pool": 14,
    "passive": "Refractive Shroud",
    "ability_1": "psionic_stealth",
    "ability_2": "force_barrier",
    "ultimate": "kinetic_implosion",
    "tp_cam_distance": 92,
    "rivals_asset_bank": "MarvelRivals/Content/Audio/WwiseAudio/InvisibleWoman"
  }
]
ABILITIES = [
  {
    "ability_id": "diamond_form",
    "hero_id": "emma_frost",
    "name": "Diamond Transformation",
    "discipline_equivalent": "Fortitude 5",
    "blood_cost": 2,
    "cooldown_sec": 12,
    "effect_description": "Encases skin in impenetrable diamond; absorbs 80% damage and increases brawling damage by 2.5x for 8 seconds.",
    "rivals_sfx": "SFX_Emma_Diamond_Activate.wav"
  },
  {
    "ability_id": "psychic_blast",
    "hero_id": "emma_frost",
    "name": "Telepathic Shockwave",
    "discipline_equivalent": "Dementation 4",
    "blood_cost": 2,
    "cooldown_sec": 8,
    "effect_description": "Projects mental wave stunning nearby kindred and mortals, causing mass disorientation for 5 seconds.",
    "rivals_sfx": "SFX_Emma_Psychic_Pulse.wav"
  },
  {
    "ability_id": "mind_wipe",
    "hero_id": "emma_frost",
    "name": "Cerebro Override (Ultimate)",
    "discipline_equivalent": "Dominate 5",
    "blood_cost": 4,
    "cooldown_sec": 30,
    "effect_description": "Completely subdues targets in a 15m radius, forcing hostiles to fight each other while restoring masquerade stability.",
    "rivals_sfx": "SFX_Emma_Ult_MindBurst.wav"
  },
  {
    "ability_id": "grapple_leap",
    "hero_id": "black_cat",
    "name": "Whip Line & Acrobatics",
    "discipline_equivalent": "Celerity 4",
    "blood_cost": 1,
    "cooldown_sec": 6,
    "effect_description": "Launches grappling cable toward rooftops or targets, propelling Felicia forward at hyper-velocity with 100% dodge.",
    "rivals_sfx": "SFX_BlackCat_Hook_Zip.wav"
  },
  {
    "ability_id": "shadow_claws",
    "hero_id": "black_cat",
    "name": "Vicious Claws Flurry",
    "discipline_equivalent": "Protean 2",
    "blood_cost": 1,
    "cooldown_sec": 4,
    "effect_description": "Multi-slash melee combo applying deep lacerations that drain enemy blood and vitality over 4 seconds.",
    "rivals_sfx": "SFX_BlackCat_Claw_Slash.wav"
  },
  {
    "ability_id": "bad_luck_curse",
    "hero_id": "black_cat",
    "name": "Jinx Aura (Ultimate)",
    "discipline_equivalent": "Thaumaturgy 4",
    "blood_cost": 3,
    "cooldown_sec": 25,
    "effect_description": "Afflicts all nearby enemies with catastrophic misfortune: firearms jam, melee attacks backfire, critical hits guaranteed.",
    "rivals_sfx": "SFX_BlackCat_Ult_Jinx.wav"
  },
  {
    "ability_id": "psionic_stealth",
    "hero_id": "invisible_woman",
    "name": "Refractive Invisibility",
    "discipline_equivalent": "Obfuscate 5",
    "blood_cost": 2,
    "cooldown_sec": 10,
    "effect_description": "Bends light around Sue, granting total invisibility even while moving, breaking enemy aggro instantly.",
    "rivals_sfx": "SFX_InvisibleWoman_Vanish.wav"
  },
  {
    "ability_id": "force_barrier",
    "hero_id": "invisible_woman",
    "name": "Psionic Force Shield",
    "discipline_equivalent": "Thaumaturgy Blood Shield",
    "blood_cost": 2,
    "cooldown_sec": 14,
    "effect_description": "Deploys a directional spherical barrier deflecting all incoming ballistic and occult attacks.",
    "rivals_sfx": "SFX_InvisibleWoman_Shield_Loop.wav"
  },
  {
    "ability_id": "kinetic_implosion",
    "hero_id": "invisible_woman",
    "name": "Force Wave Detonation (Ultimate)",
    "discipline_equivalent": "Potence 5",
    "blood_cost": 4,
    "cooldown_sec": 30,
    "effect_description": "Expands a high-density kinetic sphere that knocks all targets back into walls, dealing devastating impact damage.",
    "rivals_sfx": "SFX_InvisibleWoman_Ult_Detonate.wav"
  }
]

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
