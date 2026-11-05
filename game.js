const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- AUDIO & MUSIC ---
const bgm = new Audio('sounds/bgm.m4a'); bgm.loop = true; bgm.volume = 0.4;

// --- IMAGE & VIDEO DEFINITIONS ---
const demonData = [
    { name: "Ultrasonic Tomato", imgPath: 'images/tomato.png', videoPath: 'videos/tomato_warning.mp4' },
    { name: "Floppa Floppovich", imgPath: 'images/floppa.png', videoPath: 'videos/floppa.mp4' },
    { name: "Iister Mskl'uchitel'nyi", imgPath: 'images/iister.png', videoPath: 'videos/iister.mp4' },
    { name: "Smishnoi", imgPath: 'images/smishnoi.png', videoPath: 'videos/smishnoi.mp4' },
    { name: "Lladimir Venin", imgPath: 'images/venin.png', videoPath: 'videos/venin.mp4' },
    { name: "Kabanou", imgPath: 'images/kabanou.png', videoPath: 'videos/kabanou.mp4' }
];
demonData.forEach(d => { d.img = new Image(); d.img.src = d.imgPath; });

// --- ASSETS ---
const playerImg       = new Image(); playerImg.src       = 'images/russolini.png';
const russoliniGreenImg = new Image(); russoliniGreenImg.src = 'images/russolini_green.png';
const russoliniOrangeImg = new Image(); russoliniOrangeImg.src = 'images/russolini_orange.png';
const bossImg         = new Image(); bossImg.src         = 'images/omega_maxiushka.png';
const maxiushkaSmallImg = new Image(); maxiushkaSmallImg.src = 'images/maxiushka_small.png';
const fireBallImg     = new Image(); fireBallImg.src     = 'images/fireball.png';
const leftPawImg      = new Image(); leftPawImg.src      = 'images/paw_left.png';
const rightPawImg     = new Image(); rightPawImg.src     = 'images/paw_right.png';
const maxoBlasterImg  = new Image(); maxoBlasterImg.src  = 'images/maxo_blaster.png';
const clawImg         = new Image(); clawImg.src         = 'images/claw.png';
const cageImg         = new Image(); cageImg.src         = 'images/cage.png';
const whiteTomatoImg  = new Image(); whiteTomatoImg.src  = 'images/white_tomato.png';

// NEW SPRITES
const russoliniAttackImg = new Image(); russoliniAttackImg.src = 'images/russolini_attack.png';
const floppaAttackImg    = new Image(); floppaAttackImg.src    = 'images/floppa_attack_against_russolini_and_maxiushka.png';
const goydaBtnImg       = new Image(); goydaBtnImg.src       = 'images/goyda.png';
const goydaBtnYellowImg = new Image(); goydaBtnYellowImg.src = 'images/goyda_yellow.png';

// BUTTONS
const sboOrangeImg    = new Image(); sboOrangeImg.src    = 'images/sbo_orange.png';
const sboYellowImg    = new Image(); sboYellowImg.src    = 'images/sbo_yellow.png';
const zovOrangeImg    = new Image(); zovOrangeImg.src    = 'images/zov_orange.png';
const zovYellowImg    = new Image(); zovYellowImg.src    = 'images/zov_yellow.png';
// FIX: Ensured the filename exactly matches your screenshot (dvizhuka_yellow.png)
const dvizhuhaImg     = new Image(); dvizhuhaImg.src     = 'images/dvizhuka_yellow.png'; 

// --- ZOV ALLY ACTIONS ---
const zovActions = [
    { type: 'attack', validDemons: [0], sprite: 'tomato_attack_against_maxiushka.png', img: null },
    { type: 'attack', validDemons: [1], sprite: 'floppa_attack_against_russolini_and_maxiushka.png', img: null },
    { type: 'attack', validDemons: [1, 3], sprite: 'floppa_and_smishnoi_attack_vs_maxiushka.png', img: null },
    { type: 'attack', validDemons: [1, 2], sprite: 'iister_and_floppa_attack_vs_maxiushka.png', img: null },
    { type: 'heal', validDemons: [0], sprite: 'tomato_healing.png', img: null },
    { type: 'heal', validDemons: [2], sprite: 'iister_healing.png', img: null },
    { type: 'heal', validDemons: [5], sprite: 'kabanou_healing.png', img: null },
    { type: 'heal', validDemons: [3], sprite: 'smishnoi_healing.png', img: null },
    { type: 'heal', validDemons: [4], sprite: 'venin_healing2.png', img: null },
    { type: 'heal', validDemons: [0, 5], sprite: 'tomato_and_kabanou_healing.png', img: null },
    { type: 'heal', validDemons: [1, 3], sprite: 'floppa_and_smishnoi_healing.png', img: null },
    { type: 'heal', validDemons: [0, 4], sprite: 'venin_and_tomato_healing.png', img: null },
    { type: 'heal', validDemons: [0, 1, 5], sprite: 'tomato_floppa_and_kabanou_healing.png', img: null }
];
zovActions.forEach(action => {
    action.img = new Image();
    action.img.src = 'images/' + action.sprite;
});

// --- VIDEOS ---
const telegraphVideo = document.createElement('video');
telegraphVideo.src = 'videos/telegraph.mp4'; 
telegraphVideo.muted = true; telegraphVideo.loop = true; telegraphVideo.playsInline = true;
telegraphVideo.setAttribute('playsinline', ''); telegraphVideo.setAttribute('muted', '');
telegraphVideo.preload = 'auto'; telegraphVideo.style.display = 'none';
document.body.appendChild(telegraphVideo); telegraphVideo.load();

const warningVideos = demonData.map(d => {
    const v = document.createElement('video');
    v.src = d.videoPath; v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    v.preload = 'auto'; v.style.display = 'none';
    document.body.appendChild(v); v.load();
    return v;
});

const hitCanvas = document.createElement('canvas');
hitCanvas.width  = canvas.width; hitCanvas.height = canvas.height;
const hitCtx = hitCanvas.getContext('2d');

// --- GAME STATE ---
let gameState = 'start'; 
let gamePhase = 1;      
let phaseTimer = 0;     
let bossAlpha = 1.0;    
let demonAlpha = 0.0;
let cageAlpha = 1.0; 
let demonsFreed = 0;
let currentDemonIndex = 0;
const demonPos = { x: 400, y: 220 };

// Loop Mode / FILE 67
let isLoopMode = false;
let file67Timer = 0;

// Dialog State
let dialogPage = 0;
let dialogTimer = 0;
let dialogGoydaActive = false;
let dialogGoydaHovered = false;
let dialogGoydaClicked = false;

const allyPositions = [
    { x: 60, y: 580 }, { x: 130, y: 580 }, { x: 200, y: 580 },
    { x: 270, y: 580 }, { x: 340, y: 580 }, { x: 410, y: 580 }
];

// --- ALLIED ENTITIES & BUTTONS ---
let cboButton = { x: 0, y: 0, active: false, hovered: false };
let zovButton = { x: 0, y: 0, active: false, hovered: false };
let dvizhuhaButton = { x: 0, y: 0, active: false, hovered: false };
let goydaButton = { x: 400, y: 450, active: false, hovered: false }; 

let buttonSpawnTimer = 0;
let alliedProjectiles = []; 
let playerProjectiles = [];
let damageTexts = []; 

// --- SOUL STATES ---
let isGreenSoul = false;
let isOrangeSoul = false;
let dvizhuhaTimer = 0;
let shieldAngle = 0; 
const shieldRadius = 50;

// --- MAXIUSHKAS ATTACKS ---
let attackTimer = 0;
let projectiles = [];
let maxoBlasters = [];
let blasterTimer = 0;
let pixelPerfectBroken = false;
let claws = [];
let clawTimer = 0;
let telegraphs = [];
const TELEGRAPH_DURATION = 60;        
const TELEGRAPH_W = 100;              
const TELEGRAPH_H = 70;               
const ARENA = { left: 100, right: 700, top: 340, bottom: 550 };

// --- STATS ---
const stats = {
    goyda:     { base: 10, display: 10 },          
    svo:       { base: 0,  display: 0 },            
    dvizhuha:  { base: 10, display: 10 },        
    zov:       { base: 10, display: 10 },            
    potuzhnist:{ base: 200, display: 10 },     
    ipso:      { base: 10, display: 10 },    
    peremoha:  { base: 300,  display: 0 },       
    zrada:     { base: 0,  display: 0 },
    cbo:       { base: 10, display: 10 }
};

// --- PLAYER & BOSS ---
const PLAYER_START_HP = 271000;
const player = { x: 400, y: 450, radius: 8, speed: 4, hp: PLAYER_START_HP, maxHp: PLAYER_START_HP, invulnerableTimer: 0 };
const MAX_BOSS_HP = 200000000;
let bossHp = MAX_BOSS_HP;
const boss = { x: 400, y: 200 };

const paws = {
    left:  { x: 100, y: 350, angle: 0, state: 'idle', timer: 0 },
    right: { x: 700, y: 350, angle: 0, state: 'idle', timer: 0 },
    attackCooldown: 180
};

// ============================================================
// INPUT
// ============================================================
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (gameState === 'start') { startGame(); return; }
    
    if (e.key === 'z' || e.key === 'Z') fireInteract();
    if (e.key === ' ' && (gamePhase === 1 || gamePhase === 7)) shootPlayerProjectile(); 
    if (gameState === 'gameover' && (e.key === 'r' || e.key === 'R' || e.key === ' ')) resetGame();
});
window.addEventListener('keyup', e => keys[e.key] = false);

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const mobileControls = document.getElementById('mobile-controls');
const joystickZone   = document.getElementById('joystick-zone');
const joystickBase   = document.getElementById('joystick-base');
const joystickKnob   = document.getElementById('joystick-knob');
const interactBtn    = document.getElementById('interact-btn');

if (isTouchDevice) mobileControls.classList.remove('hidden');

const joystick = { active: false, id: null, dx: 0, dy: 0 };
const JOYSTICK_MAX = 60;   
let interactPressed = false;

function fireInteract() { if (gameState === 'playing' || gameState === 'dialog') interactPressed = true; }
function consumeInteract() { if (interactPressed) { interactPressed = false; return true; } return false; }
function getCenter(el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
function applyJoystick(clientX, clientY) {
    const c = getCenter(joystickBase); let dx = clientX - c.x; let dy = clientY - c.y;
    const dist = Math.hypot(dx, dy);
    if (dist > JOYSTICK_MAX) { dx = dx / dist * JOYSTICK_MAX; dy = dy / dist * JOYSTICK_MAX; }
    joystick.dx = dx / JOYSTICK_MAX; joystick.dy = dy / JOYSTICK_MAX;
    joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}
function releaseJoystick() { joystick.active = false; joystick.id = null; joystick.dx = 0; joystick.dy = 0; joystickKnob.style.transform = 'translate(-50%, -50%)'; }
joystickZone.addEventListener('touchstart', e => { if (joystick.active) return; const t = e.changedTouches[0]; joystick.active = true; joystick.id = t.identifier; applyJoystick(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
joystickZone.addEventListener('touchmove', e => { for (const t of e.changedTouches) { if (t.identifier === joystick.id) { applyJoystick(t.clientX, t.clientY); e.preventDefault(); return; } } }, { passive: false });
function endTouchJoystick(e) { for (const t of e.changedTouches) { if (t.identifier === joystick.id) { releaseJoystick(); return; } } }
joystickZone.addEventListener('touchend', endTouchJoystick); joystickZone.addEventListener('touchcancel', endTouchJoystick);
joystickZone.addEventListener('mousedown', e => { if (joystick.active) return; joystick.active = true; joystick.id = 'mouse'; applyJoystick(e.clientX, e.clientY); e.preventDefault(); });
window.addEventListener('mousemove', e => { if (joystick.active && joystick.id === 'mouse') applyJoystick(e.clientX, e.clientY); });
window.addEventListener('mouseup', () => { if (joystick.active && joystick.id === 'mouse') releaseJoystick(); });
interactBtn.addEventListener('touchstart', e => { e.preventDefault(); interactBtn.classList.add('pressed'); fireInteract(); }, { passive: false });
interactBtn.addEventListener('touchend', e => { e.preventDefault(); interactBtn.classList.remove('pressed'); }, { passive: false });
interactBtn.addEventListener('mousedown', e => { e.preventDefault(); interactBtn.classList.add('pressed'); fireInteract(); });
window.addEventListener('mouseup', () => interactBtn.classList.remove('pressed'));

canvas.addEventListener('touchstart', e => { 
    if (gameState === 'start') { startGame(); e.preventDefault(); }
    else if (gameState === 'gameover') { e.preventDefault(); resetGame(); } 
}, { passive: false });
canvas.addEventListener('click', () => { 
    if (gameState === 'start') startGame();
    else if (gameState === 'gameover') resetGame(); 
});

// ============================================================
// START & GAME LOOP
// ============================================================
function startGame() {
    gameState = 'playing';
    bgm.play().catch(()=>{});
    telegraphVideo.play().catch(()=>{});
}

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }

function resetGame() {
    gameState = 'playing';
    player.hp = PLAYER_START_HP; player.x = 400; player.y = 450; player.invulnerableTimer = 0;
    bossHp = MAX_BOSS_HP; demonsFreed = 0; currentDemonIndex = 0;
    gamePhase = 1; phaseTimer = 0; bossAlpha = 1.0; demonAlpha = 0.0; cageAlpha = 1.0;
    isGreenSoul = false; isOrangeSoul = false; dvizhuhaTimer = 0;
    isLoopMode = false; file67Timer = 0;
    
    telegraphVideo.currentTime = 0; telegraphVideo.play().catch(()=>{});
    warningVideos.forEach(v => v.pause());
    bgm.currentTime = 0; bgm.play().catch(()=>{});
    
    attackTimer = 0; projectiles = []; maxoBlasters = []; blasterTimer = 0;
    claws = []; clawTimer = 0; telegraphs = []; alliedProjectiles = []; playerProjectiles = [];
    damageTexts = [];
    cboButton.active = false; zovButton.active = false; dvizhuhaButton.active = false; buttonSpawnTimer = 0;
    
    paws.left.state  = 'idle'; paws.left.timer  = 0; paws.left.x  = 100; paws.left.angle  = 0;
    paws.right.state = 'idle'; paws.right.timer = 0; paws.right.x = 700; paws.right.angle = 0;
    paws.attackCooldown = 180; interactPressed = false;
    
    stats.goyda.base = 10; stats.svo.base = 0; stats.dvizhuha.base = 10; stats.zov.base = 10;
    stats.potuzhnist.base = 10; stats.ipso.base = 10; stats.peremoha.base = 0; stats.zrada.base = 0;
    stats.cbo.base = 10;
}

function calculateDamage(baseValue) {
    let dmg = baseValue * 1000000; 
    dmg *= (1 + (stats.goyda.base / 10));
    dmg *= (1 + (stats.peremoha.base / 10));
    dmg *= Math.max(0.1, 1 - (stats.zrada.base / 100));
    return dmg;
}

function shootPlayerProjectile() {
    const damage = calculateDamage(1);
    playerProjectiles.push({ x: player.x, y: player.y, vy: -10, radius: 15, damage, sprite: russoliniAttackImg });
}

function damagePlayer(amount) {
    if (player.invulnerableTimer > 0) return;
    // BALANCE UPDATE: Increased base damage multiplier from 20 to 30
    let finalDamage = (amount * 60) * (1 + (stats.goyda.base / 100));
    finalDamage *= (1 + (stats.peremoha.base / 100));
    finalDamage *= Math.max(0.2, 1 - (stats.zrada.base / 100));

    player.hp -= finalDamage;
    player.invulnerableTimer = 60;
    stats.peremoha.base += 0.5; 
}

function spawnDamageText(x, y, amount) {
    damageTexts.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y,
        text: Math.round(amount).toString(),
        life: 60,
        maxLife: 60,
        vy: -2
    });
}

function update() {
    // --- DIALOGUE LOGIC ---
    if (gameState === 'dialog') {
        if (dialogGoydaActive) {
            dialogGoydaHovered = Math.hypot(400 - goydaButton.x, 450 - goydaButton.y) < 60;
            if (consumeInteract()) {
                dialogGoydaActive = false;
                dialogGoydaClicked = true;
                for(let i=0; i<3; i++){
                    playerProjectiles.push({ 
                        x: player.x - 40 + (i * 40), 
                        y: player.y, 
                        vy: -10, 
                        radius: 15, 
                        damage: 0, 
                        sprite: russoliniAttackImg,
                        life: 120
                    });
                }
            }
        } else if (dialogPage < 5) {
            if (consumeInteract()) {
                dialogPage++;
                if (dialogPage === 5) {
                    dialogGoydaActive = true;
                    dialogGoydaClicked = false;
                }
            }
        } else if (dialogPage === 5 && !dialogGoydaActive) {
            if (playerProjectiles.length === 0) {
                dialogPage = 6;
            }
        } else if (dialogPage === 6) {
            dialogTimer++;
            if (dialogTimer >= 240) { // 4 seconds
                isLoopMode = true;
                demonsFreed = 0;
                bossHp = MAX_BOSS_HP;
                player.hp = PLAYER_START_HP;
                gameState = 'playing';
                gamePhase = 1;
                phaseTimer = 0;
                bossAlpha = 1.0;
                demonAlpha = 0;
                stats.potuzhnist.base += 50;
                file67Timer = 300; // 5 seconds
                
                projectiles = []; alliedProjectiles = []; playerProjectiles = [];
                cboButton.active = false; zovButton.active = false; dvizhuhaButton.active = false;
                bgm.currentTime = 0; bgm.play().catch(()=>{});
            }
        }

        for (let i = playerProjectiles.length - 1; i >= 0; i--) {
            const pp = playerProjectiles[i]; pp.y += pp.vy;
            if (pp.life !== undefined) { pp.life--; if(pp.life<=0) playerProjectiles.splice(i,1); }
        }
        return; 
    }

    if (gameState !== 'playing') return;

    if (file67Timer > 0) file67Timer--;

    phaseTimer++;
    
    // --- PHASE TIMELINE LOGIC ---
    if (gamePhase === 1) {
        let phaseDuration = (demonsFreed >= 1) ? 7200 : 1500;
        if (phaseTimer >= phaseDuration) { 
            // BUGFIX: If all demons are freed, do not try to transition to Phase 2. Just keep fighting Maxiushka!
            if (demonsFreed >= demonData.length) {
                phaseTimer = 0; // Reset timer and continue the endless fight
            } else if (isLoopMode) {
                phaseTimer = 0;
                bossHp = MAX_BOSS_HP;
                player.hp = PLAYER_START_HP;
                stats.potuzhnist.base += 50;
                file67Timer = 300;
                projectiles = []; alliedProjectiles = [];
                player.x = 400; player.y = 450;
            } else {
                gamePhase = 2; phaseTimer = 0; 
                telegraphVideo.pause(); 
                if (warningVideos[currentDemonIndex]) {
                    warningVideos[currentDemonIndex].currentTime = 0;
                    warningVideos[currentDemonIndex].play().catch(()=>{}); 
                }
            }
        }
    } else if (gamePhase === 2) {
        if (phaseTimer >= 360) { gamePhase = 3; phaseTimer = 0; }
    } else if (gamePhase === 3) {
        bossAlpha -= 0.02;
        if (bossAlpha <= 0) { bossAlpha = 0; gamePhase = 4; phaseTimer = 0; demonAlpha = 1.0; cageAlpha = 1.0; }
    } else if (gamePhase === 4) {
        let demonDuration = (currentDemonIndex === 1) ? 2700 : 1200;
        if (currentDemonIndex === 1) {
            isGreenSoul = true;
        }
        
        if (phaseTimer >= demonDuration) { 
            isGreenSoul = false;
            gamePhase = 5; phaseTimer = 0; 
            cboButton.x = ARENA.left + 60 + Math.random() * (ARENA.right - ARENA.left - 120);
            cboButton.y = ARENA.top + 60 + Math.random() * (ARENA.bottom - ARENA.top - 120);
            cboButton.active = true;
        }
    } else if (gamePhase === 5) {
        // Waiting for liberation CBO
    } else if (gamePhase === 6) {
        if (phaseTimer < 120) { cageAlpha -= 0.01; }
        else if (phaseTimer < 360) { cageAlpha = 0; demonAlpha -= 0.01; }
        else {
            demonAlpha = 0; currentDemonIndex++; demonsFreed++;
            gamePhase = 7; phaseTimer = 0; bossAlpha = 0;
        }
    } else if (gamePhase === 7) {
        bossAlpha += 0.02;
        if (bossAlpha >= 1.0) { bossAlpha = 1.0; gamePhase = 1; phaseTimer = 0; telegraphVideo.play().catch(()=>{}); }
    }

    // Check for 90% HP threshold
    if (bossHp <= MAX_BOSS_HP * 0.7 && gameState === 'playing') {
        gameState = 'dialog';
        dialogPage = 0;
        dialogTimer = 0;
        bossAlpha = 0; demonAlpha = 0; cageAlpha = 0;
        projectiles = []; alliedProjectiles = []; playerProjectiles = []; claws = []; maxoBlasters = [];
        return;
    }

    // --- FLUCTUATE STATS ---
    const time = Date.now() / 500;
    for (let key in stats) {
        stats[key].display = stats[key].base + Math.sin(time * (1 + Math.random() * 0.5)) * 2;
        const el = document.getElementById(`stat-${key}`);
        if (el) el.innerText = Math.round(stats[key].display);
    }

    // --- UPDATE DAMAGE NUMBERS ---
    for (let i = damageTexts.length - 1; i >= 0; i--) {
        const t = damageTexts[i];
        t.y += t.vy;
        t.life--;
        if (t.life <= 0) damageTexts.splice(i, 1);
    }

    // --- ORANGE SOUL TIMER ---
    if (isOrangeSoul) {
        dvizhuhaTimer--;
        if (dvizhuhaTimer <= 0) isOrangeSoul = false;
    }

    // --- MOVEMENT & PLAYER STATE ---
    if (isGreenSoul) {
        player.x = 400; player.y = 450;
        if (joystick.active && (Math.abs(joystick.dx) > 0.1 || Math.abs(joystick.dy) > 0.1)) {
            shieldAngle = Math.atan2(joystick.dy, joystick.dx);
        } else {
            if (keys['ArrowLeft'] || keys['a']) shieldAngle = Math.PI;
            if (keys['ArrowRight'] || keys['d']) shieldAngle = 0;
            if (keys['ArrowUp'] || keys['w']) shieldAngle = -Math.PI/2;
            if (keys['ArrowDown'] || keys['s']) shieldAngle = Math.PI/2;
        }
    } else {
        let currentSpeed = player.speed * (1 + (stats.dvizhuha.base / 100));
        if (isOrangeSoul) currentSpeed *= 2; 
        
        if (keys['ArrowLeft']  || keys['a']) player.x -= currentSpeed;
        if (keys['ArrowRight'] || keys['d']) player.x += currentSpeed;
        if (keys['ArrowUp']    || keys['w']) player.y -= currentSpeed;
        if (keys['ArrowDown']  || keys['s']) player.y += currentSpeed;
        if (joystick.active) { player.x += joystick.dx * currentSpeed; player.y += joystick.dy * currentSpeed; }

        if (player.x - player.radius < 100) player.x = 100;
        if (player.x + player.radius > 700) player.x = 700;
        if (player.y - player.radius < 300) player.y = 300;
        if (player.y + player.radius > 550) player.y = 550;
    }
    if (player.invulnerableTimer > 0) player.invulnerableTimer--;

    // --- BUTTON SPAWNING ---
    if (gamePhase === 1 || gamePhase === 7) {
        buttonSpawnTimer++;
        if (buttonSpawnTimer > 180) {
            buttonSpawnTimer = 0;
            if (!cboButton.active && Math.random() * 100 < stats.cbo.base) {
                cboButton.x = ARENA.left + 60 + Math.random() * (ARENA.right - ARENA.left - 120);
                cboButton.y = ARENA.top + 60 + Math.random() * (ARENA.bottom - ARENA.top - 120);
                cboButton.active = true;
            }
            if (!isLoopMode && demonsFreed >= 1 && !zovButton.active && Math.random() * 100 < stats.zov.base) {
                zovButton.x = ARENA.left + 60 + Math.random() * (ARENA.right - ARENA.left - 120);
                zovButton.y = ARENA.top + 60 + Math.random() * (ARENA.bottom - ARENA.top - 120);
                zovButton.active = true;
            }
        }
    }

    // --- BUTTON INTERACTION ---
    if (cboButton.active) {
        const distCBO = Math.hypot(player.x - cboButton.x, player.y - cboButton.y);
        cboButton.hovered = (distCBO < 40 + player.radius);
        if (cboButton.hovered && consumeInteract()) {
            cboButton.active = false;
            if (gamePhase === 5) {
                gamePhase = 6; phaseTimer = 0; alliedProjectiles = []; 
                stats.svo.base += 25; stats.zrada.base += 20; stats.goyda.base += 5;
            } else {
                shootPlayerProjectile();
                stats.cbo.base = Math.max(0, stats.cbo.base - 0.5);
            }
        }
    }
    
    if (zovButton.active) {
        const distZOV = Math.hypot(player.x - zovButton.x, player.y - zovButton.y);
        zovButton.hovered = (distZOV < 40 + player.radius);
        if (zovButton.hovered && consumeInteract()) {
            zovButton.active = false;
            stats.zov.base = Math.max(0, stats.zov.base - 0.5);
            
            if (demonsFreed >= 6 && Math.random() < 0.5 && !dvizhuhaButton.active) {
                dvizhuhaButton.x = ARENA.left + 60 + Math.random() * (ARENA.right - ARENA.left - 120);
                dvizhuhaButton.y = ARENA.top + 60 + Math.random() * (ARENA.bottom - ARENA.top - 120);
                dvizhuhaButton.active = true;
            }

            const freedDemons = [];
            for(let i=0; i<demonsFreed; i++) freedDemons.push(i);
            const validActions = zovActions.filter(action => action.validDemons.some(d => freedDemons.includes(d)));
            
            if (validActions.length > 0) {
                const chosen = validActions[Math.floor(Math.random() * validActions.length)];
                const spawnPos = allyPositions[Math.floor(Math.random() * demonsFreed)];
                alliedProjectiles.push({ 
                    x: spawnPos.x, y: spawnPos.y, 
                    vx: 10, vy: -5, hp: 3, 
                    sprite: chosen.img, type: chosen.type, damage: calculateDamage(5)
                });
            }
        }
    }

    if (dvizhuhaButton.active) {
        const distDvizhuha = Math.hypot(player.x - dvizhuhaButton.x, player.y - dvizhuhaButton.y);
        dvizhuhaButton.hovered = (distDvizhuha < 40 + player.radius);
        if (dvizhuhaButton.hovered && consumeInteract()) {
            dvizhuhaButton.active = false;
            isOrangeSoul = true;
            dvizhuhaTimer = 1200; 
        }
    }
    
    if (gamePhase === 1 || gamePhase === 7) {
        stats.cbo.base = Math.min(10, stats.cbo.base + 0.02);
        stats.zov.base = Math.min(10, stats.zov.base + 0.02);
    }

    // --- PHASE 1 & 7 MAXIUSHKAS ATTACKS ---
    if (gamePhase === 1 || gamePhase === 7) {
        const fireRate = Math.max(5, 15 - (stats.potuzhnist.base / 2));
        attackTimer++;
        if (attackTimer >= fireRate) {
            const a = Math.random() * Math.PI * 2;
            const s = 5 + (stats.potuzhnist.base / 20);
            projectiles.push({ x: boss.x, y: boss.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, radius: 15, hp: 1 });
            attackTimer = 0;
        }

        paws.attackCooldown--;
        if (paws.attackCooldown <= 0) {
            if (Math.random() > 0.5) { paws.left.state = 'attacking'; paws.left.timer = 0; }
            else                     { paws.right.state = 'attacking'; paws.right.timer = 0; }
            paws.attackCooldown = 240;
        }

        blasterTimer++;
        if (blasterTimer >= 120) { spawnMaxoBlaster(); blasterTimer = 0; }

        clawTimer++;
        if (clawTimer >= 60) { queueClaw(); clawTimer = 0; }
    }

    // --- PHASE 4 DEMON ATTACKS ---
    if (gamePhase === 4) {
        if (currentDemonIndex === 0) {
            if (phaseTimer % 12 === 0) { 
                alliedProjectiles.push({
                    x: ARENA.left + 20 + Math.random() * (ARENA.right - ARENA.left - 40),
                    y: ARENA.top - 50, vx: 0, vy: 4 + Math.random() * 2, hp: 3,
                    sprite: whiteTomatoImg, type: 'enemy'
                });
            }
        } else if (currentDemonIndex === 1) {
            if (phaseTimer % 20 === 0) {
                const edge = Math.floor(Math.random() * 4);
                let x, y, vx, vy;
                const s = 4.5;
                if (edge === 0) { x = 400 + (Math.random()-0.5)*300; y = ARENA.top; vx = 0; vy = s; }
                else if (edge === 1) { x = 400 + (Math.random()-0.5)*300; y = ARENA.bottom; vx = 0; vy = -s; }
                else if (edge === 2) { x = ARENA.left; y = 450 + (Math.random()-0.5)*150; vx = s; vy = 0; }
                else { x = ARENA.right; y = 450 + (Math.random()-0.5)*150; vx = -s; vy = 0; }
                
                const angle = Math.atan2(vy, vx);
                alliedProjectiles.push({
                    x, y, vx, vy, hp: 3,
                    sprite: floppaAttackImg, type: 'enemy', angle: angle
                });
            }
        } else if (currentDemonIndex === 2) {
            if (phaseTimer % 45 === 0) {
                const a = Math.atan2(player.y - demonPos.y, player.x - demonPos.x);
                projectiles.push({ x: demonPos.x, y: demonPos.y, vx: Math.cos(a)*5, vy: Math.sin(a)*5, radius: 15, hp: 1 });
            }
        } else if (currentDemonIndex === 3) {
            if (phaseTimer % 10 === 0) {
                const a = phaseTimer * 0.06;
                projectiles.push({ x: demonPos.x, y: demonPos.y, vx: Math.cos(a)*4.5, vy: Math.sin(a)*4.5, radius: 15, hp: 1 });
                projectiles.push({ x: demonPos.x, y: demonPos.y, vx: Math.cos(a + Math.PI)*4.5, vy: Math.sin(a + Math.PI)*4.5, radius: 15, hp: 1 });
            }
        } else if (currentDemonIndex === 4) {
            if (phaseTimer % 90 === 0) {
                for (let k = 0; k < 10; k++) {
                    const a = (k / 10) * Math.PI * 2 + phaseTimer * 0.01;
                    projectiles.push({ x: demonPos.x, y: demonPos.y, vx: Math.cos(a)*4, vy: Math.sin(a)*4, radius: 15, hp: 1 });
                }
            }
        } else if (currentDemonIndex === 5) {
            if (phaseTimer % 15 === 0) {
                const a = Math.random() * Math.PI * 2;
                projectiles.push({ x: demonPos.x, y: demonPos.y, vx: Math.cos(a)*5, vy: Math.sin(a)*5, radius: 15, hp: 1 });
            }
        }
    }

    // --- UPDATE ALLIED/ENEMY PROJECTILES ---
    for (let i = alliedProjectiles.length - 1; i >= 0; i--) {
        const ap = alliedProjectiles[i];
        ap.x += ap.vx || 0; ap.y += ap.vy || 0;

        if (ap.type === 'enemy' || ap.type === 'heal') {
            const dist = Math.hypot(ap.x - player.x, ap.y - player.y);
            
            if (isGreenSoul && dist < shieldRadius + 30) {
                let angleToProj = Math.atan2(ap.y - player.y, ap.x - player.x);
                let diff = Math.abs(shieldAngle - angleToProj);
                if (diff > Math.PI) diff = Math.PI * 2 - diff;
                
                if (diff < Math.PI / 2.5) { 
                    alliedProjectiles.splice(i, 1); 
                    continue;
                }
            }
            
            if (dist < 30 + player.radius) {
                if (ap.type === 'enemy') damagePlayer(15); // Increased from 10
                else if (ap.type === 'heal') player.hp = Math.min(player.hp + 50000, player.maxHp); // BALANCE UPDATE: Massive heal!
                alliedProjectiles.splice(i, 1); continue;
            }
        }

        if (ap.type === 'attack' && ap.x > 100 && ap.x < 700 && ap.y > -50 && ap.y < 300) {
            bossHp -= ap.damage; 
            spawnDamageText(ap.x, ap.y, ap.damage);
            alliedProjectiles.splice(i, 1); continue;
        }
        
        if (ap.x < -100 || ap.x > 900 || ap.y < -100 || ap.y > 700) alliedProjectiles.splice(i, 1);
    }

    // Update Player Projectiles
    for (let i = playerProjectiles.length - 1; i >= 0; i--) {
        const pp = playerProjectiles[i]; pp.y += pp.vy;
        if (pp.life !== undefined) { pp.life--; if(pp.life<=0) playerProjectiles.splice(i,1); }
        if (pp.y < 100) { playerProjectiles.splice(i, 1); continue; }
        if (pp.x > 100 && pp.x < 700 && pp.y > -50 && pp.y < 300) {
            bossHp -= pp.damage/10; 
            spawnDamageText(pp.x, pp.y, pp.damage);
            playerProjectiles.splice(i, 1);
        }
    }

    // --- MAXIUSHKAS PROJECTILES ---
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i]; p.x += p.vx; p.y += p.vy;
        
        for (let j = alliedProjectiles.length - 1; j >= 0; j--) {
            if (Math.hypot(p.x - alliedProjectiles[j].x, p.y - alliedProjectiles[j].y) < 30) {
                alliedProjectiles[j].hp--;
                if (alliedProjectiles[j].hp <= 0) alliedProjectiles.splice(j, 1);
                p.hp--;
            }
        }

        if (p.hp > 0 && Math.hypot(p.x - player.x, p.y - player.y) < p.radius + player.radius) damagePlayer(8); // Increased from 5
        if (p.x < -100 || p.x > 900 || p.y < -100 || p.y > 700 || p.hp <= 0) projectiles.splice(i, 1);
    }

    // --- PAWS ---
    ['left', 'right'].forEach(side => {
        const paw = paws[side];
        if (paw.state !== 'attacking') return;
        paw.timer++;
        if (side === 'left') { paw.angle =  Math.sin(paw.timer * 0.01) * 0.1; paw.x = 200 + Math.sin(paw.timer * 0.1) * 200; }
        else                 { paw.angle = -Math.sin(paw.timer * 0.01) * 0.1; paw.x = 500 - Math.sin(paw.timer * 0.1) * 200; }

        if (paw.timer <= 60) {
            if (checkPawCollision(paw.x, paw.y, paw.angle, side === 'left' ? leftPawImg : rightPawImg))
                damagePlayer(25); // Increased from 15
        } else {
            paw.state = 'idle'; paw.angle = 0; paw.x = side === 'left' ? 100 : 700;
        }
    });

    for (let i = maxoBlasters.length - 1; i >= 0; i--) {
        const b = maxoBlasters[i];
        if (b.state === 'charging') {
            b.timer--; 
            const inaccuracy = (Math.random() - 0.5) * (stats.ipso.base / 20);
            b.angle = Math.atan2(player.y - b.y, player.x - b.x) + inaccuracy;
            if (b.timer <= 0) { b.state = 'firing'; b.timer = 15; }
        } else if (b.state === 'firing') {
            b.timer--;
            if (checkLaserHit(b)) damagePlayer(40); // Increased from 25
            if (b.timer <= 0) maxoBlasters.splice(i, 1);
        }
    }

    for (let i = telegraphs.length - 1; i >= 0; i--) {
        const t = telegraphs[i]; t.timer--;
        if (t.timer <= 0) { claws.push(t.claw); telegraphs.splice(i, 1); }
    }

    const EXIT_MARGIN = 100;
    for (let i = claws.length - 1; i >= 0; i--) {
        const c = claws[i]; c.x += c.vx; c.y += c.vy;
        if (Math.hypot(c.x - player.x, c.y - player.y) < c.radius + player.radius) {
            damagePlayer(30); claws.splice(i, 1); continue; // Increased from 20
        }
        if (c.x < ARENA.left - EXIT_MARGIN || c.x > ARENA.right + EXIT_MARGIN || c.y < ARENA.top - EXIT_MARGIN || c.y > ARENA.bottom + EXIT_MARGIN) {
            claws.splice(i, 1);
        }
    }

    if (player.hp <= 0) gameState = 'gameover';
}

// ============================================================
// SPAWN HELPERS & COLLISION
// ============================================================
function spawnMaxoBlaster() {
    const a = Math.random() * Math.PI * 2; const d = Math.random() * 100;
    const bx = player.x + Math.cos(a) * d; const by = player.y + Math.sin(a) * d;
    maxoBlasters.push({ x: bx, y: by, angle: 0, state: 'charging', timer: 60 });
}

function queueClaw() {
    const edge = Math.floor(Math.random() * 4);
    let x, y, targetX, targetY;
    const rx = ARENA.left + Math.random() * (ARENA.right  - ARENA.left);
    const ry = ARENA.top  + Math.random() * (ARENA.bottom - ARENA.top);
    switch (edge) {
        case 0: x = rx; y = ARENA.top; targetX = ARENA.left + Math.random() * (ARENA.right  - ARENA.left); targetY = ARENA.bottom; break;
        case 1: x = ARENA.right; y = ry; targetX = ARENA.left; targetY = ARENA.top + Math.random() * (ARENA.bottom - ARENA.top); break;
        case 2: x = rx; y = ARENA.bottom; targetX = ARENA.left + Math.random() * (ARENA.right  - ARENA.left); targetY = ARENA.top; break;
        case 3: x = ARENA.left; y = ry; targetX = ARENA.right; targetY = ARENA.top + Math.random() * (ARENA.bottom - ARENA.top); break;
    }
    const angle = Math.atan2(targetY - y, targetX - x);
    const speed = 5, OFFSET = 40;
    const clawX = x - Math.cos(angle) * OFFSET;
    const clawY = y - Math.sin(angle) * OFFSET;
    telegraphs.push({
        x: clawX, y: clawY, angle, timer: TELEGRAPH_DURATION, maxTimer: TELEGRAPH_DURATION,
        claw: { x: clawX, y: clawY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, angle, radius: 20 }
    });
}

function checkLaserHit(blaster) {
    const L = 2000, ex = blaster.x + Math.cos(blaster.angle) * L, ey = blaster.y + Math.sin(blaster.angle) * L;
    const num = Math.abs((ey - blaster.y) * player.x - (ex - blaster.x) * player.y + ex * blaster.y - ey * blaster.x);
    const den = Math.hypot(ex - blaster.x, ey - blaster.y);
    return num / den < player.radius + 15;
}

function checkPawCollision(pawX, pawY, angle, img) {
    if (!img.complete || img.naturalWidth === 0) return false;
    if (pixelPerfectBroken) return Math.hypot(player.x - pawX, player.y - pawY) < 80;
    hitCtx.clearRect(0, 0, hitCanvas.width, hitCanvas.height);
    hitCtx.save(); hitCtx.translate(pawX, pawY); hitCtx.rotate(angle);
    hitCtx.drawImage(img, -img.width / 2, -img.height / 2); hitCtx.restore();
    if (player.x >= 0 && player.x < hitCanvas.width && player.y >= 0 && player.y < hitCanvas.height) {
        try { const px = hitCtx.getImageData(player.x, player.y, 1, 1).data; return px[3] > 0; }
        catch (e) { pixelPerfectBroken = true; return Math.hypot(player.x - pawX, player.y - pawY) < 80; }
    }
    return false;
}

// ============================================================
// DRAWING
// ============================================================
function draw() {
    ctx.fillStyle = '#1a0b00';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState !== 'dialog') {
        ctx.strokeStyle = 'rgba(255, 152, 0, 0.55)'; ctx.lineWidth = 2;
        ctx.strokeRect(ARENA.left, ARENA.top, ARENA.right - ARENA.left, ARENA.bottom - ARENA.top);
    }

    // --- 1. DRAW MAXIUSHKAS LAYER ---
    if (bossAlpha > 0) {
        ctx.globalAlpha = bossAlpha;
        if (bossImg.complete && bossImg.naturalWidth > 0) {
            ctx.drawImage(bossImg, boss.x - 450, boss.y - 200, 900, 400);
        } else {
            ctx.fillStyle = '#ff9800'; ctx.fillRect(boss.x - 100, boss.y - 100, 200, 200);
        }
        
        // VIDEOS (No TV Borders, fitting in the sprite screen)
        let activeVideo = null;
        if (gamePhase === 1 || gamePhase === 7) activeVideo = telegraphVideo;
        else if (gamePhase === 2 || gamePhase === 3) activeVideo = warningVideos[currentDemonIndex];

        if (activeVideo && activeVideo.readyState >= 2) {
            const tvW = 193, tvH = 76;
            const tvX = 374, tvY = 73; 
            ctx.drawImage(activeVideo, tvX - tvW/2, tvY - tvH/2, tvW, tvH);
        }

        ctx.save(); ctx.translate(paws.left.x, paws.left.y); ctx.rotate(paws.left.angle);
        if (leftPawImg.complete && leftPawImg.naturalWidth > 0) ctx.drawImage(leftPawImg, -100, -100, 200, 200);
        ctx.restore();
        ctx.save(); ctx.translate(paws.right.x, paws.right.y); ctx.rotate(paws.right.angle);
        if (rightPawImg.complete && rightPawImg.naturalWidth > 0) ctx.drawImage(rightPawImg, -100, -100, 200, 200);
        ctx.restore();
        ctx.globalAlpha = 1.0;
    }

    // --- 2. FREED ALLIES (Bottom Left) ---
    if (demonsFreed >= 1 && (gamePhase === 1 || gamePhase === 7)) {
        for (let i = 0; i < demonsFreed; i++) {
            const pos = allyPositions[i];
            const dSprite = demonData[i].img;
            if (dSprite.complete && dSprite.naturalWidth > 0) {
                ctx.drawImage(dSprite, pos.x - 30, pos.y - 30, 60, 60);
            }
        }
    }

    // --- 3. DRAW DEMON LAYER ---
    if (demonAlpha > 0 && currentDemonIndex < demonData.length) {
        ctx.globalAlpha = demonAlpha;
        const dSprite = demonData[currentDemonIndex].img;
        if (dSprite && dSprite.complete && dSprite.naturalWidth > 0) {
            ctx.drawImage(dSprite, demonPos.x - 100, demonPos.y - 100, 200, 200);
        }
        ctx.globalAlpha = 1.0;
    }

    // --- 4. DRAW CAGE LAYER ---
    if (cageAlpha > 0 && gamePhase >= 4 && gamePhase <= 6) {
        ctx.globalAlpha = cageAlpha;
        if (cageImg.complete && cageImg.naturalWidth > 0) {
            ctx.drawImage(cageImg, demonPos.x - 120, demonPos.y - 120, 240, 240);
        }
        ctx.globalAlpha = 1.0;
    }

    // --- 5. ALLIED / ENEMY PROJECTILES ---
    for (const ap of alliedProjectiles) {
        if (ap.sprite && ap.sprite.complete && ap.sprite.naturalWidth > 0) {
            ctx.save();
            ctx.translate(ap.x, ap.y);
            if (ap.angle !== undefined) ctx.rotate(ap.angle);
            ctx.drawImage(ap.sprite, -45, -45, 90, 90);
            ctx.restore();
        } else {
            ctx.fillStyle = (ap.type === 'enemy') ? '#ff0000' : (ap.type === 'heal' ? '#00ff00' : '#ffff00');
            ctx.beginPath(); ctx.arc(ap.x, ap.y, 20, 0, Math.PI * 2); ctx.fill();
        }
    }

    // --- 6. PLAYER PROJECTILES ---
    for (const pp of playerProjectiles) {
        if (pp.sprite && pp.sprite.complete && pp.sprite.naturalWidth > 0) {
            ctx.drawImage(pp.sprite, pp.x - 30, pp.y - 30, 60, 60);
        } else {
            ctx.fillStyle = '#ff00ff'; ctx.beginPath(); ctx.arc(pp.x, pp.y, pp.radius, 0, Math.PI * 2); ctx.fill();
        }
    }

    // --- 7. TELEGRAPHS & CLAWS ---
    for (const t of telegraphs) {
        const p = 1 - t.timer / t.maxTimer;
        ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.angle);
        const pulse = 0.65 + 0.35 * Math.sin(Date.now() / 60);
        ctx.globalAlpha = Math.min(1, p * 4) * pulse;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
        ctx.fillRect(-TELEGRAPH_W/2, -TELEGRAPH_H/2, TELEGRAPH_W, TELEGRAPH_H);
        ctx.restore(); ctx.globalAlpha = 1.0;
    }

    for (const c of claws) {
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.angle);
        if (clawImg.complete && clawImg.naturalWidth > 0) ctx.drawImage(clawImg, -50, -50, 100, 100);
        else {
            ctx.fillStyle = 'rgba(220, 220, 220, 0.95)'; ctx.strokeStyle = 'rgba(150, 150, 150, 1)'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo( 40,  0); ctx.lineTo( 0, -20); ctx.lineTo(-40,  0); ctx.lineTo( 0,  20); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        ctx.restore();
    }

    // --- 8. MAXO-BLASTERS ---
    for (const b of maxoBlasters) {
        if (b.state === 'firing') {
            ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + Math.cos(b.angle) * 2000, b.y + Math.sin(b.angle) * 2000);
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'; ctx.lineWidth = 20; ctx.stroke();
            ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; ctx.lineWidth = 8;  ctx.stroke();
        }
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.angle);
        const scale = b.state === 'charging' ? 1 + Math.sin(Date.now() / 50) * 0.1 : 1;
        if (maxoBlasterImg.complete && maxoBlasterImg.naturalWidth > 0) ctx.drawImage(maxoBlasterImg, -40 * scale, -40 * scale, 80 * scale, 80 * scale);
        else { ctx.fillStyle = b.state === 'charging' ? 'purple' : 'red'; ctx.fillRect(-20 * scale, -20 * scale, 40 * scale, 40 * scale); }
        ctx.restore();
    }

    // --- 9. BUTTONS ---
    if (cboButton.active) {
        ctx.save();
        const img = cboButton.hovered ? sboYellowImg : sboOrangeImg;
        if (img.complete && img.naturalWidth > 0) ctx.drawImage(img, cboButton.x - 50, cboButton.y - 25, 100, 50);
        else { ctx.fillStyle = cboButton.hovered ? '#ffd700' : '#ff8c00'; ctx.fillRect(cboButton.x - 50, cboButton.y - 25, 100, 50); }
        ctx.restore();
    }
    if (zovButton.active) {
        ctx.save();
        const img = zovButton.hovered ? zovYellowImg : zovOrangeImg;
        if (img.complete && img.naturalWidth > 0) ctx.drawImage(img, zovButton.x - 50, zovButton.y - 25, 100, 50);
        else { ctx.fillStyle = zovButton.hovered ? '#ffd700' : '#ff8c00'; ctx.fillRect(zovButton.x - 50, zovButton.y - 25, 100, 50); }
        ctx.restore();
    }
    if (dvizhuhaButton.active) {
        ctx.save();
        // This draws the custom Dvizhukha sprite
        if (dvizhuhaImg.complete && dvizhuhaImg.naturalWidth > 0) {
            ctx.drawImage(dvizhuhaImg, dvizhuhaButton.x - 60, dvizhuhaButton.y - 25, 120, 50);
        } else { 
            ctx.fillStyle = dvizhuhaButton.hovered ? '#ffd700' : '#ff8c00'; 
            ctx.fillRect(dvizhuhaButton.x - 60, dvizhuhaButton.y - 25, 120, 50); 
        }
        ctx.restore();
    }

    // --- 10. PLAYER & SHIELD ---
    let currentPlayerImg = playerImg;
    if (isGreenSoul) currentPlayerImg = russoliniGreenImg;
    else if (isOrangeSoul) currentPlayerImg = russoliniOrangeImg;

    if (currentPlayerImg.complete && currentPlayerImg.naturalWidth > 0 && gameState !== 'dialog') {
        if (player.invulnerableTimer <= 0 || Math.floor(Date.now() / 50) % 2 === 0) {
            ctx.drawImage(currentPlayerImg, player.x - 16, player.y - 16, 32, 32);
        }
    } else if (gameState !== 'dialog') {
        ctx.fillStyle = isGreenSoul ? '#00ff00' : (isOrangeSoul ? '#ffa500' : 'red'); 
        ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2); ctx.fill();
    }

    if (isGreenSoul && gameState !== 'dialog') {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(shieldAngle);
        if (russoliniAttackImg.complete && russoliniAttackImg.naturalWidth > 0) {
            ctx.drawImage(russoliniAttackImg, shieldRadius, -20, 60, 40);
        }
        ctx.restore();
    }

    // Fireballs
    for (const p of projectiles) {
        if (fireBallImg.complete && fireBallImg.naturalWidth > 0) ctx.drawImage(fireBallImg, p.x - 20, p.y - 20, 40, 40);
        else { ctx.fillStyle = '#ff9800'; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); }
    }

    // Damage Numbers
    ctx.textAlign = 'center';
    ctx.font = '40px "Hachicro", monospace';
    for (const t of damageTexts) {
        ctx.globalAlpha = Math.min(1, t.life / (t.maxLife * 0.5));
        ctx.fillStyle = '#ff0000';
        ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1.0;

    // UI
    if (gameState !== 'dialog') {
        ctx.fillStyle = '#fff'; ctx.font = '24px "Determination", monospace'; ctx.textAlign = 'left';
        ctx.fillText("HP: " + Math.ceil(player.hp) + " / " + player.maxHp, 50, 40);
        
        ctx.fillStyle = '#555'; ctx.fillRect(50, 70, 200, 20);
        ctx.fillStyle = '#c0392b'; ctx.fillRect(50, 70, Math.max(0, Math.min(1, player.hp / player.maxHp)) * 200, 20);
    }

    // FILE 67 LOADED Message
    if (file67Timer > 0) {
        ctx.globalAlpha = Math.min(1, file67Timer / 60);
        ctx.fillStyle = '#fff'; ctx.font = '28px "Hachicro", monospace'; ctx.textAlign = 'right';
        ctx.fillText("FILE 67 LOADED", canvas.width - 50, canvas.height - 50);
        ctx.globalAlpha = 1.0;
    }

    // Start Screen
    if (gameState === 'start') {
        ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff9800'; ctx.font = '50px "Hachicro", monospace'; ctx.textAlign = 'center';
        ctx.fillText("OMEGA MAXIUSHKA", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = '#fff'; ctx.font = '24px "Determination", monospace';
        ctx.fillText(isTouchDevice ? "Tap to Start" : "Click or Press any Key to Start", canvas.width / 2, canvas.height / 2 + 40);
    }
    // Game over
    else if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff'; ctx.font = '40px "Hachicro", monospace'; ctx.textAlign = 'center';
        ctx.fillText("Leave them alone.", canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px "Determination", monospace';
        ctx.fillText(isTouchDevice ? "Tap to try again" : "Press R to try again", canvas.width / 2, canvas.height / 2 + 40);
    }
    // Dialog
    else if (gameState === 'dialog') {
        if (maxiushkaSmallImg.complete && maxiushkaSmallImg.naturalWidth > 0) {
            ctx.drawImage(maxiushkaSmallImg, canvas.width / 2 - 100, 80, 200, 200);
        }

        ctx.fillStyle = '#000';
        ctx.fillRect(40, 350, 720, 200);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 350, 720, 200);

        ctx.fillStyle = '#fff';
        ctx.font = '24px "Determination", monospace';
        ctx.textAlign = 'left';
        
        let lines = [];
        if (dialogPage === 0) lines = ["* What have you done!"];
        else if (dialogPage === 1) lines = ["* All of these nazis, ruscists and communist...", "* they are all free now to deal chaos in Memeworld."];
        else if (dialogPage === 2) lines = ["* Are you satisfied with that? What is the reason", "* to make the innocent people suffer?"];
        else if (dialogPage === 3) lines = ["* For demons' sake? For revanchism? For patriotism?"];
        else if (dialogPage === 4) lines = ["* They, who constantly tell 'Своих не бросаем'", "* left you behind!"];
        else if (dialogPage === 5) lines = ["* ..."]; 
        else if (dialogPage === 6) lines = ["* Your cringy doings have no sense, because if you", "* don't stop now, I will play with you forever!", "* I will protect my beloved stepparents and I will", "* have eternal fun with you. FOREVER"];

        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 70, 390 + (i * 30));
        }

        if (dialogPage < 6 && !dialogGoydaActive) {
            ctx.font = '16px "Determination", monospace';
            ctx.fillStyle = '#aaa';
            ctx.textAlign = 'right';
            ctx.fillText("[Click or Press Z to continue...]", 730, 530);
        }

        if (dialogGoydaActive) {
            const img = dialogGoydaHovered ? goydaBtnYellowImg : goydaBtnImg;
            if (img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, 400 - 50, 450 - 25, 100, 50);
            } else {
                ctx.fillStyle = dialogGoydaHovered ? '#ffd700' : '#ff8c00';
                ctx.fillRect(400 - 50, 450 - 25, 100, 50);
            }
            
            if (!img.complete || img.naturalWidth === 0) {
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                ctx.font = '24px "Determination", monospace';
                ctx.fillText("ГОЙДА", 400, 465);
            }
        }
    }
}

gameLoop();
