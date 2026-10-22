import fs from "fs";
import path from "path";

const sheets = ["heroes.json", "abilities.json", "systems.json", "hooks.json"];
let errors = [];

const data = {};
for (const file of sheets) {
  const filePath = path.join("sheets", file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing sheet: ${filePath}`);
    continue;
  }
  const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data[file] = content;

  // Check unfilled cells
  content.rows.forEach((row, idx) => {
    for (const col of content.columns) {
      if (row[col] === undefined || row[col] === null || row[col] === "") {
        errors.push(`Unfilled cell in ${file} at row ${idx} (${row.name || row.hero_id || row.system_id || idx}), column ${col}`);
      }
    }
  });
}

// Cross-sheet reference checking
if (data["heroes.json"] && data["abilities.json"]) {
  const heroIds = new Set(data["heroes.json"].rows.map(h => h.hero_id));
  const abilityIds = new Set(data["abilities.json"].rows.map(a => a.ability_id));

  // Verify hero abilities reference valid ability_ids
  data["heroes.json"].rows.forEach(hero => {
    ["ability_1", "ability_2", "ultimate"].forEach(abKey => {
      const abId = hero[abKey];
      if (!abilityIds.has(abId)) {
        errors.push(`Hero ${hero.hero_id} references unknown ability '${abId}'`);
      }
    });
  });

  // Verify abilities reference valid heroes
  data["abilities.json"].rows.forEach(ab => {
    if (!heroIds.has(ab.hero_id)) {
      errors.push(`Ability ${ab.ability_id} references unknown hero '${ab.hero_id}'`);
    }
  });
}

if (errors.length > 0) {
  console.error("PREFLIGHT FAILED with errors:");
  errors.forEach(e => console.error(" - " + e));
  process.exit(1);
} else {
  console.log("PREFLIGHT PASSED: All sheets verified and all references resolved cleanly.");
}
