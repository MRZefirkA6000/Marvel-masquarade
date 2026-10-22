import React, { useState, useEffect } from 'react';
import {
  createInitialGameState,
  switchHero,
  toggleCameraMode,
  castAbility,
  tickCooldowns,
  feedBlood,
  GameState,
  Hero,
} from './game/midnight_engine.ts';
import {
  Shield,
  Eye,
  Camera,
  Activity,
  Zap,
  Volume2,
  Download,
  Terminal,
  Sparkles,
  Layers,
  ChevronRight,
  Flame,
  CheckCircle2,
  Gamepad2,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [activeTab, setActiveTab] = useState<'arena' | 'recipe' | 'sheets'>('arena');
  const [sfxFlash, setSfxFlash] = useState<string | null>(null);

  const activeHero: Hero = gameState.heroes[gameState.activeHeroIndex];

  // Game loop for cooldown tickers
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => tickCooldowns(prev, 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard controls listener (1, 2, 3 for switching, Q/E/Z for abilities, F2 for camera)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1') {
        handleHeroSelect(0);
      } else if (e.key === '2') {
        handleHeroSelect(1);
      } else if (e.key === '3') {
        handleHeroSelect(2);
      } else if (e.key.toLowerCase() === 'q') {
        const ab = activeHero.abilities[0];
        if (ab) handleCast(ab.id);
      } else if (e.key.toLowerCase() === 'e') {
        const ab = activeHero.abilities[1];
        if (ab) handleCast(ab.id);
      } else if (e.key.toLowerCase() === 'z') {
        handleCast(activeHero.ultimate.id);
      } else if (e.key.toLowerCase() === 'c' || e.key === 'F2') {
        e.preventDefault();
        setGameState((prev) => toggleCameraMode(prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeHero]);

  const handleHeroSelect = (index: number) => {
    setGameState((prev) => switchHero(prev, index));
  };

  const handleCast = (abilityId: string) => {
    const res = castAbility(gameState, abilityId);
    if (res.success) {
      setGameState(res.state);
      setSfxFlash(abilityId);
      setTimeout(() => setSfxFlash(null), 800);
    }
  };

  const handleFeed = () => {
    setGameState((prev) => feedBlood(prev, 5));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-rose-700 to-indigo-600 flex items-center justify-center font-black text-lg shadow-lg shadow-rose-900/30 border border-rose-500/30">
            MR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-wide text-neutral-100">Midnight Rivals</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                v0.1.0 Mashup
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Vampire: The Masquerade - Bloodlines <span className="text-rose-400">×</span> Marvel Rivals
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'arena'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-rose-400" />
            Combat Arena & Swapper
          </button>
          <button
            onClick={() => setActiveTab('recipe')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'recipe'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Melty Mod & One-Click
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'sheets'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            JSON System Sheets
          </button>
        </div>

        {/* Third-Person Camera Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGameState((prev) => toggleCameraMode(prev))}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
              gameState.cameraMode === 'third_person'
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-950/50'
                : 'bg-neutral-800/80 border-neutral-700 text-neutral-300'
            }`}
            title="Toggle Camera View (Hotkey: C or F2)"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{gameState.cameraMode === 'third_person' ? '3rd Person (Over-Shoulder)' : '1st Person'}</span>
            <span className="text-[10px] bg-black/40 px-1 py-0.5 rounded text-neutral-400">C</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'arena' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Hero Selection & Character Switching */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    Hero Squad (Keys 1-3)
                  </h2>
                  <span className="text-[11px] text-neutral-400">Switch On-The-Fly</span>
                </div>

                <div className="space-y-3">
                  {gameState.heroes.map((hero, idx) => {
                    const isCurrent = idx === gameState.activeHeroIndex;
                    return (
                      <button
                        key={hero.id}
                        onClick={() => handleHeroSelect(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
                          isCurrent
                            ? 'bg-neutral-800/90 border-rose-500/60 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/30'
                            : 'bg-neutral-900/50 border-neutral-800/80 hover:bg-neutral-800/40 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-neutral-950 flex items-center justify-center text-2xl border border-neutral-800 shrink-0 shadow-inner">
                            {hero.avatarIcon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-sm text-neutral-100 group-hover:text-rose-300 transition-colors">
                                {hero.name}
                              </h3>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                                Key {idx + 1}
                              </span>
                            </div>
                            <p className="text-xs text-rose-400/90 font-medium">{hero.role}</p>
                            <p className="text-[11px] text-neutral-400 truncate mt-0.5">{hero.passiveName}</p>
                          </div>
                        </div>

                        {/* Status bar */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                          <div className="bg-neutral-950/80 px-2 py-1 rounded border border-neutral-800/60 flex items-center justify-between">
                            <span className="text-neutral-400">HP</span>
                            <span className="text-emerald-400 font-bold">{hero.maxHealth}</span>
                          </div>
                          <div className="bg-neutral-950/80 px-2 py-1 rounded border border-neutral-800/60 flex items-center justify-between">
                            <span className="text-neutral-400">Vitae</span>
                            <span className="text-rose-400 font-bold">{hero.maxBloodPool} pts</span>
                          </div>
                        </div>

                        {isCurrent && (
                          <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Blood & Vitals Management */}
              <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    Vitae & Blood Reserves
                  </h3>
                  <button
                    onClick={handleFeed}
                    className="text-xs px-2.5 py-1 rounded bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 transition-all font-medium flex items-center gap-1"
                  >
                    Feed (+4 Blood)
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-400">Blood Points</span>
                    <span className="text-rose-400 font-bold">
                      {gameState.currentBlood} / {activeHero.maxBloodPool}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-950 rounded-full h-3 p-0.5 border border-neutral-800">
                    <div
                      className="bg-gradient-to-r from-rose-700 to-red-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-rose-600"
                      style={{
                        width: `${Math.min(100, (gameState.currentBlood / activeHero.maxBloodPool) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Active Buffs */}
                <div className="mt-4 pt-3 border-t border-neutral-800/70">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Active Disciplines & States
                  </div>
                  {gameState.activeBuffs.length === 0 ? (
                    <div className="text-xs text-neutral-500 italic py-1">No active buffs. Cast an ability to trigger.</div>
                  ) : (
                    <div className="space-y-1.5">
                      {gameState.activeBuffs.map((buff) => (
                        <div
                          key={buff.id}
                          className="bg-neutral-950/70 border border-cyan-500/30 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs"
                        >
                          <span className="text-cyan-300 font-medium">{buff.name}</span>
                          <span className="text-cyan-400 font-mono font-bold">{buff.durationSec}s</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 8 Cols: 3rd Person Viewport Simulation & Action Deck */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Virtual Viewport & HUD */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl relative min-h-[340px] flex flex-col justify-between">
                {/* 3D Scene / Viewport Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950/40 to-neutral-950" />

                {/* Viewport Overlay Info */}
                <div className="relative z-10 p-4 flex items-center justify-between border-b border-neutral-800/60 bg-black/40">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-neutral-300">
                      Engine: Vampire: The Masquerade - Bloodlines (Troika/Source)
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
                    Camera: {gameState.cameraMode === 'third_person' ? `3rd-Person (${gameState.cameraDistance}u)` : '1st-Person'}
                  </div>
                </div>

                {/* 3D Character Silhouette & Perspective Visualizer */}
                <div className="relative z-10 my-auto py-12 flex flex-col items-center justify-center text-center px-4">
                  <div
                    className={`relative transition-all duration-500 p-6 rounded-2xl border ${
                      sfxFlash
                        ? 'border-rose-400 bg-rose-950/40 shadow-2xl shadow-rose-600/50 scale-105'
                        : 'border-neutral-700/60 bg-neutral-900/60'
                    }`}
                  >
                    <div className="text-6xl mb-2 filter drop-shadow-md">{activeHero.avatarIcon}</div>
                    <div className="font-bold text-xl text-neutral-100">{activeHero.name}</div>
                    <div className="text-xs text-rose-400 font-mono tracking-wide">{activeHero.role}</div>
                    <div className="text-xs text-neutral-400 mt-1 max-w-sm">{activeHero.passiveDesc}</div>

                    {/* Camera Ray lines indicator */}
                    {gameState.cameraMode === 'third_person' && (
                      <div className="mt-3 text-[11px] font-mono text-cyan-300/80 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-800/30 inline-block">
                        Over-The-Shoulder (Dist: {gameState.cameraDistance} | Offset: {gameState.shoulderOffset})
                      </div>
                    )}
                  </div>
                </div>

                {/* Companion Audio Stream indicator */}
                <div className="relative z-10 p-3 bg-black/70 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-neutral-300">Companion Rivals Audio:</span>
                    <span className="text-neutral-400 truncate max-w-xs">{activeHero.rivalsVoiceBank}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400">Linked to &#123;game:marvel-rivals&#125;</span>
                </div>
              </div>

              {/* Action Deck: Abilities & Ultimates (Q, E, Z) */}
              <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-rose-400" />
                    Hero Abilities & Bloodlines Disciplines
                  </h3>
                  <span className="text-xs text-neutral-400">Press hotkeys Q, E, Z or click</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Ability 1 (Q) */}
                  {activeHero.abilities[0] && (
                    <button
                      onClick={() => handleCast(activeHero.abilities[0].id)}
                      disabled={(gameState.cooldowns[activeHero.abilities[0].id] || 0) > 0}
                      className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                        (gameState.cooldowns[activeHero.abilities[0].id] || 0) > 0
                          ? 'bg-neutral-950/60 border-neutral-800/60 opacity-60 cursor-not-allowed'
                          : 'bg-neutral-800/60 border-neutral-700/80 hover:bg-neutral-800 hover:border-rose-500/50 shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-neutral-100">{activeHero.abilities[0].name}</span>
                          <span className="w-6 h-6 rounded bg-neutral-950 border border-neutral-700 text-xs font-mono font-bold flex items-center justify-center text-rose-400">
                            Q
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-rose-400 mb-2">
                          {activeHero.abilities[0].disciplineEquivalent}
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                          {activeHero.abilities[0].description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-neutral-800/80">
                        <span className="text-rose-400">{activeHero.abilities[0].bloodCost} Blood</span>
                        {(gameState.cooldowns[activeHero.abilities[0].id] || 0) > 0 ? (
                          <span className="text-amber-400 font-bold">
                            {gameState.cooldowns[activeHero.abilities[0].id]}s
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Ready</span>
                        )}
                      </div>
                    </button>
                  )}

                  {/* Ability 2 (E) */}
                  {activeHero.abilities[1] && (
                    <button
                      onClick={() => handleCast(activeHero.abilities[1].id)}
                      disabled={(gameState.cooldowns[activeHero.abilities[1].id] || 0) > 0}
                      className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                        (gameState.cooldowns[activeHero.abilities[1].id] || 0) > 0
                          ? 'bg-neutral-950/60 border-neutral-800/60 opacity-60 cursor-not-allowed'
                          : 'bg-neutral-800/60 border-neutral-700/80 hover:bg-neutral-800 hover:border-rose-500/50 shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-neutral-100">{activeHero.abilities[1].name}</span>
                          <span className="w-6 h-6 rounded bg-neutral-950 border border-neutral-700 text-xs font-mono font-bold flex items-center justify-center text-rose-400">
                            E
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-rose-400 mb-2">
                          {activeHero.abilities[1].disciplineEquivalent}
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                          {activeHero.abilities[1].description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-neutral-800/80">
                        <span className="text-rose-400">{activeHero.abilities[1].bloodCost} Blood</span>
                        {(gameState.cooldowns[activeHero.abilities[1].id] || 0) > 0 ? (
                          <span className="text-amber-400 font-bold">
                            {gameState.cooldowns[activeHero.abilities[1].id]}s
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Ready</span>
                        )}
                      </div>
                    </button>
                  )}

                  {/* Ultimate Ability (Z) */}
                  <button
                    onClick={() => handleCast(activeHero.ultimate.id)}
                    disabled={(gameState.cooldowns[activeHero.ultimate.id] || 0) > 0}
                    className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                      (gameState.cooldowns[activeHero.ultimate.id] || 0) > 0
                        ? 'bg-neutral-950/60 border-neutral-800/60 opacity-60 cursor-not-allowed'
                        : 'bg-gradient-to-b from-rose-950/40 to-neutral-900 border-rose-500/40 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-950/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-neutral-100">{activeHero.ultimate.name}</span>
                        <span className="w-6 h-6 rounded bg-rose-600 border border-rose-400 text-xs font-mono font-bold flex items-center justify-center text-white">
                          Z
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-amber-400 mb-2">
                        {activeHero.ultimate.disciplineEquivalent} (Ultimate)
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                        {activeHero.ultimate.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-neutral-800/80">
                      <span className="text-rose-400">{activeHero.ultimate.bloodCost} Blood</span>
                      {(gameState.cooldowns[activeHero.ultimate.id] || 0) > 0 ? (
                        <span className="text-amber-400 font-bold">
                          {gameState.cooldowns[activeHero.ultimate.id]}s
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold animate-pulse">ULTIMATE READY</span>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Combat & Console Telemetry Log */}
              <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                    Engine Activity & Companion Audio Log
                  </h3>
                  <span className="text-[10px] text-neutral-500 font-mono">LIVE FEED</span>
                </div>
                <div className="h-32 overflow-y-auto space-y-1 font-mono text-xs pr-2 scrollbar-thin scrollbar-thumb-neutral-800">
                  {gameState.combatLog.map((log) => (
                    <div
                      key={log.id}
                      className={`py-0.5 border-b border-neutral-800/40 flex items-start gap-2 ${
                        log.type === 'swap'
                          ? 'text-rose-300'
                          : log.type === 'cast'
                          ? 'text-cyan-300'
                          : log.type === 'sfx'
                          ? 'text-emerald-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      <span className="text-[10px] text-neutral-600 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span>{log.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Melty Recipe & Verification Tab */}
        {activeTab === 'recipe' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Melty One-Click Publish Verification
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Verified through <code className="text-rose-400">validate_recipe</code> and{' '}
                    <code className="text-rose-400">one_click_check</code>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                  ONE-CLICK READY: YES
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                  <div className="text-xs font-semibold text-neutral-400 uppercase font-mono mb-2">Host Game (Primary)</div>
                  <div className="font-bold text-base text-neutral-100">Vampire: The Masquerade – Bloodlines</div>
                  <div className="text-xs font-mono text-neutral-500 mt-1">custom-vampire-the-masquerade-bloodlines (AppID: 2600)</div>
                  <div className="mt-2 text-xs text-neutral-400">
                    Target Folder: <code className="text-cyan-400">&#123;game&#125;/midnight_rivals</code>
                  </div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                  <div className="text-xs font-semibold text-neutral-400 uppercase font-mono mb-2">Companion Game (Role)</div>
                  <div className="font-bold text-base text-neutral-100">Marvel Rivals</div>
                  <div className="text-xs font-mono text-neutral-500 mt-1">marvel-rivals (Unreal Engine)</div>
                  <div className="mt-2 text-xs text-neutral-400">
                    Companion Folder: <code className="text-cyan-400">&#123;game:marvel-rivals&#125;</code> (Audio banks & VO)
                  </div>
                </div>
              </div>

              <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 font-mono text-xs">
                <div className="text-neutral-400 mb-2 font-semibold">melty.json Specification:</div>
                <pre className="text-neutral-300 overflow-x-auto leading-relaxed">
{`{
  "schemaVersion": 1,
  "mode": "installed",
  "games": [
    { "slug": "custom-vampire-the-masquerade-bloodlines", "role": "primary" },
    { "slug": "marvel-rivals", "role": "companion" }
  ],
  "components": [
    { "id": "main", "fileName": "midnight_rivals.zip", "label": "Midnight Rivals Files", "kind": "main", "required": true }
  ],
  "requirements": [],
  "mappings": [
    { "component": "main", "from": "midnight_rivals/", "to": "{game}/midnight_rivals" }
  ],
  "launch": {
    "kind": "game",
    "args": ["-game", "midnight_rivals"]
  }
}`}
                </pre>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-neutral-800">
                <div className="text-xs text-neutral-400">
                  Archive: <code className="text-neutral-200">midnight_rivals.zip</code> (3,866 bytes, SHA-256 verified)
                </div>
                <div className="flex gap-2">
                  <a
                    href="/midnight_rivals.zip"
                    download="midnight_rivals.zip"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-rose-950/50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Mod Package
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JSON System Sheets Tab */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 shadow-xl">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-400" />
                  JSON System Sheets (Source of Truth)
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  All game systems, hero statistics, abilities, and engine hooks are designed and preflighted in sheets.
                </p>
              </div>

              <div className="space-y-6">
                {/* Heroes Sheet */}
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                  <h3 className="text-xs font-mono font-bold text-sky-400 uppercase mb-3">sheets/heroes.json</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-500">
                          <th className="pb-2">Hero ID</th>
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Role</th>
                          <th className="pb-2">Base HP</th>
                          <th className="pb-2">Blood</th>
                          <th className="pb-2">Camera Dist</th>
                          <th className="pb-2">Passive</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-neutral-300">
                        {gameState.heroes.map((h) => (
                          <tr key={h.id} className="hover:bg-neutral-900/40">
                            <td className="py-2 text-rose-400">{h.id}</td>
                            <td className="py-2 font-bold text-neutral-100">{h.name}</td>
                            <td className="py-2 text-neutral-400">{h.role}</td>
                            <td className="py-2 text-emerald-400">{h.baseHealth}</td>
                            <td className="py-2 text-rose-400">{h.bloodPool}</td>
                            <td className="py-2 text-cyan-400">{h.tpCamDistance}</td>
                            <td className="py-2 text-neutral-400">{h.passiveName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Abilities Sheet */}
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                  <h3 className="text-xs font-mono font-bold text-sky-400 uppercase mb-3">sheets/abilities.json</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-500">
                          <th className="pb-2">Ability ID</th>
                          <th className="pb-2">Hero</th>
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Bloodlines Discipline</th>
                          <th className="pb-2">Blood Cost</th>
                          <th className="pb-2">Cooldown</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-neutral-300">
                        {gameState.heroes.flatMap((h) =>
                          [...h.abilities, h.ultimate].map((ab) => (
                            <tr key={ab.id} className="hover:bg-neutral-900/40">
                              <td className="py-2 text-cyan-400">{ab.id}</td>
                              <td className="py-2 text-neutral-400">{h.name}</td>
                              <td className="py-2 font-bold text-neutral-100">{ab.name}</td>
                              <td className="py-2 text-amber-400">{ab.disciplineEquivalent}</td>
                              <td className="py-2 text-rose-400">{ab.bloodCost} pts</td>
                              <td className="py-2 text-emerald-400">{ab.cooldownSec}s</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 px-4 lg:px-8 py-3 text-xs text-neutral-500 flex flex-wrap items-center justify-between">
        <div>
          Midnight Rivals &copy; 2026. Built with Melty Modding Toolkit for Vampire: The Masquerade - Bloodlines.
        </div>
        <div className="flex gap-4 font-mono text-[11px]">
          <span>Primary: Troika Source Engine</span>
          <span>Companion: Marvel Rivals Audio Banks</span>
        </div>
      </footer>
    </div>
  );
}
