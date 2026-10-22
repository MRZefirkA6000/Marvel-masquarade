import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialGameState,
  switchHero,
  toggleCameraMode,
  castAbility,
  tickCooldowns,
  feedBlood,
  INITIAL_HEROES,
} from './midnight_engine.ts';

test('initial state has 3 heroes with Emma Frost active in third-person camera', () => {
  const state = createInitialGameState();
  assert.equal(state.heroes.length, 3);
  assert.equal(state.heroes[0].name, 'Emma Frost');
  assert.equal(state.heroes[1].name, 'Black Cat');
  assert.equal(state.heroes[2].name, 'Invisible Woman');
  assert.equal(state.activeHeroIndex, 0);
  assert.equal(state.cameraMode, 'third_person');
  assert.equal(state.cameraDistance, 90);
  assert.equal(state.currentHealth, 150);
  assert.equal(state.currentBlood, 15);
});

test('switching heroes updates active index, camera distance, and blood pool bounds', () => {
  let state = createInitialGameState();

  // Switch to Black Cat (index 1)
  state = switchHero(state, 1);
  assert.equal(state.activeHeroIndex, 1);
  assert.equal(state.heroes[state.activeHeroIndex].name, 'Black Cat');
  assert.equal(state.cameraDistance, 85);
  assert.equal(state.currentBlood, 12); // Clamped to Black Cat's maxBloodPool of 12

  // Switch to Invisible Woman (index 2)
  state = switchHero(state, 2);
  assert.equal(state.activeHeroIndex, 2);
  assert.equal(state.heroes[state.activeHeroIndex].name, 'Invisible Woman');
  assert.equal(state.cameraDistance, 92);
});

test('toggling camera switches between third-person and first-person', () => {
  let state = createInitialGameState();
  assert.equal(state.cameraMode, 'third_person');
  assert.equal(state.cameraDistance, 90);

  state = toggleCameraMode(state);
  assert.equal(state.cameraMode, 'first_person');
  assert.equal(state.cameraDistance, 0);

  state = toggleCameraMode(state);
  assert.equal(state.cameraMode, 'third_person');
  assert.equal(state.cameraDistance, 90);
});

test('casting ability consumes blood and triggers cooldown and active buff', () => {
  let state = createInitialGameState();
  const res = castAbility(state, 'diamond_form');
  assert.equal(res.success, true);
  state = res.state;

  // Diamond form costs 2 blood and 12s cooldown
  assert.equal(state.currentBlood, 13);
  assert.equal(state.cooldowns['diamond_form'], 12);
  assert.equal(state.activeBuffs.length, 1);
  assert.equal(state.activeBuffs[0].id, 'diamond_form');

  // Verify companion audio path in combat log
  const sfxLog = state.combatLog.find(l => l.type === 'sfx');
  assert.ok(sfxLog);
  assert.ok(sfxLog.text.includes('{game:marvel-rivals}'));

  // Attempt to recast while on cooldown fails
  const recastRes = castAbility(state, 'diamond_form');
  assert.equal(recastRes.success, false);
  assert.ok(recastRes.reason?.includes('cooldown'));
});

test('casting fails if blood is insufficient', () => {
  let state = createInitialGameState();
  state.currentBlood = 1; // Not enough for Cerebro Override (costs 4)
  const res = castAbility(state, 'mind_wipe');
  assert.equal(res.success, false);
  assert.ok(res.reason?.includes('Insufficient Blood'));
});

test('tickCooldowns decrements cooldowns and expires buffs', () => {
  let state = createInitialGameState();
  state = castAbility(state, 'diamond_form').state;
  assert.equal(state.cooldowns['diamond_form'], 12);
  assert.equal(state.activeBuffs[0].durationSec, 8);

  state = tickCooldowns(state, 5);
  assert.equal(state.cooldowns['diamond_form'], 7);
  assert.equal(state.activeBuffs[0].durationSec, 3);

  state = tickCooldowns(state, 4);
  assert.equal(state.cooldowns['diamond_form'], 3);
  assert.equal(state.activeBuffs.length, 0); // Buff expired
});

test('feedBlood restores blood up to character max', () => {
  let state = createInitialGameState();
  state.currentBlood = 8;
  state = feedBlood(state, 4);
  assert.equal(state.currentBlood, 12);
  state = feedBlood(state, 10);
  assert.equal(state.currentBlood, 15); // Clamped to 15
});
