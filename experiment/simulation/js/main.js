/* =========================================
   1. SCALING LOGIC (Fixes Resize Issue)
   ========================================= */
function scaleStage() {
  const stage = document.getElementById('stage_concrete');
  const container = document.getElementById('canvas_concrete');
  
  if (!stage || !container) return;

  const designWidth = 1536;
  const designHeight = 730;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const scaleX = windowWidth / designWidth;
  const scaleY = windowHeight / designHeight;
  const scale = Math.min(scaleX, scaleY);

  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener('load', scaleStage);
window.addEventListener('resize', scaleStage);


/* =========================================
   2. GLOBALS & HELPERS
   ========================================= */
let dropCount = 0;
const MAX_DROPS = 3;

function $(id){ return document.getElementById(id); }
function show(id){ const el=$(id); if(el) el.style.visibility='visible'; }
function hide(id){ const el=$(id); if(el) el.style.visibility='hidden'; }
function after(ms, fn){ setTimeout(fn, ms); }

function addActor({ id, src, z=5, parent='stage_concrete' }) {
  const p = document.getElementById(parent);
  const el = document.createElement('img');
  el.id = id;
  el.src = src;
  el.className = 'actor';
  el.style.zIndex = z;
  el.style.visibility = 'hidden';
  p.appendChild(el);
  return el;
}

function setInstruction(stepClass) {
  const box = document.getElementById('instructionBox');
  if(box) {
      box.className = stepClass; 
  }
}

function dismissTitleScreen() {
  const screen = document.getElementById('title_screen');
  if (screen) {
    screen.style.opacity = '0';
    setTimeout(() => {
      screen.style.visibility = 'hidden';
      setInstruction("step-1"); 
    }, 500); 
  }
}


/* =========================================
   3. ASSET REGISTRATION
   ========================================= */
function registerConcreteIntroAssets(){
  if($('tray')) return; 
  addActor({ id:'tray',       src:'images/concrete_tray.png', z:1 });
  addActor({ id:'spade',      src:'images/spade.png',          z:3 });
  addActor({ id:'base_stage', src:'images/base_stage.png',     z:1 });
}

function registerCone(){
  if (!$('cone')) addActor({ id:'cone', src:'images/cone.png', z:5 });
}

function registerTrayStep(){
  if(!$('tray_step3')) addActor({ id:'tray_step3',  src:'images/concrete_tray.png', z:6 });
  if(!$('spade_step3')) addActor({ id:'spade_step3', src:'images/spade.png',         z:7 });
}

function registerConcretePiece(){
  if(!$('concrete_piece')) addActor({ id:'concrete_piece', src:'images/concrete_piece.png', z:8 });
}

function registerArrowStep(){
  if(!$('arrow_step3')) addActor({ id:'arrow_step3', src:'images/arrow.png', z:9 });
}

function registerConcrete1(){
  if(!$('smaller_concrete')) addActor({ id:'smaller_concrete', src:'images/smaller_concrete.png', z:8 });
}

function registerLeveler(){
  if(!$('leveler')) addActor({ id: 'leveler', src: 'images/leveler.png', z: 15 });
}

function registerLevelerArrow(){
  if(!$('arrow_leveler')) addActor({ id: 'arrow_leveler', src: 'images/arrow.png', z: 30 });
}

function registerLevelerArrowFinal() {
  if(!$('arrow_leveler_final')) addActor({ id: 'arrow_leveler_final', src: 'images/arrow.png', z: 40 });
}

function registerLevelerArrowFinal2() {
  if(!$('arrow_leveler_final2')) addActor({ id: 'arrow_leveler_final2', src: 'images/arrow.png', z: 40 });
}

function registerScale(){
    if(!$('scale')) addActor({ id: 'scale', src: 'images/ruler.png', z: 8 });
}

function registerArrowScale() {
    if(!$('arrow_scale')) addActor({ id: 'arrow_scale', src: 'images/arrow.png', z: 20 });
}

function registerMeasureLines() {
    if(!$('measure_line_top')){
        addActor({ id: 'measure_line_top', src: '', z: 30 });
        $('measure_line_top').className = 'measure_line';
    }
    if(!$('measure_line_bottom')){
        addActor({ id: 'measure_line_bottom', src: '', z: 30 });
        $('measure_line_bottom').className = 'measure_line';
    }
}

function registerMeasureValueLabel() {
    if(!$('measure_value_label')) {
        const stage = document.getElementById('stage_concrete');
        const div = document.createElement('div');
        div.id = 'measure_value_label';
        div.innerHTML = "Slump value = 20 cm";
        div.className = 'measure_value_label';
        stage.appendChild(div);
    }
}

function registerLevelerMeasure() {
    if(!$('leveler_measure')) addActor({ id: 'leveler_measure', src: 'images/leveler.png', z: 20 });
}


/* =========================================
   4. MAIN SCENE LOGIC
   ========================================= */

/* --- Step 1: Intro --- */
function scene_start_concrete(){
  setInstruction("step-2");
  hide('prompt_concrete_start');
  registerConcreteIntroAssets();

  show('tray');
  $('tray').style.animation = 'tray_slide_up 0.9s ease-out forwards';

  if ($('heap')) {
    after(400, function(){
      show('heap');
      $('heap').style.animation = 'heap_rise_in 0.8s ease-out forwards';
    });
  }

  after(800, function(){
    show('spade');
    $('spade').style.animation = 'spade_drop_in 0.7s ease-out forwards';
  });

  after(1600, function(){
    show('next_concrete');
    $('next_concrete').style.animation = 'next_pop 0.35s ease-out forwards';
    after(380, function(){
      // UPDATED: Blinking
      $('next_concrete').style.animation = 'next_blink 1.2s infinite ease-in-out';
    });
  });
}

/* --- Step 2: Transition to Base --- */
function showBaseStage(){
  setInstruction("step-3");
  const next = $('next_concrete');
  if(next){
    next.style.animation = '';
    next.style.pointerEvents = 'none'; 
  }

  hide('tray');
  if ($('heap')) hide('heap');
  hide('spade');

  show('base_stage');
  $('base_stage').style.animation = 'base_fade_in 400ms ease-out forwards';

  after(450, function(){
    if(next){
      next.style.pointerEvents = 'auto';
      next.onclick = showConeStage;                      
      // UPDATED: Blinking
      next.style.animation = 'next_blink 1.2s infinite ease-in-out';
    }
  });
}

/* --- Step 3: Show Cone --- */
function showConeStage(){
  setInstruction("step-4");
  const next = $('next_concrete');
  if(next){
    next.style.animation = '';
    next.style.pointerEvents = 'none';
  }

  registerCone();
  show('cone');
  $('cone').style.animation = 'cone_pop_in 600ms ease-out forwards';

  after(650, function(){
    if(next){
      next.style.pointerEvents = 'auto';
      next.onclick = showTrayStep;                         
      // UPDATED: Blinking
      next.style.animation = 'next_blink 1.2s infinite ease-in-out';
    }
  });
}

/* --- Step 4: Tray + Spade appear --- */
function showTrayStep(){
  setInstruction("step-5");
  const next = $('next_concrete');
  if(next){
    next.style.animation = '';
    next.style.pointerEvents = 'none';
  }

  registerTrayStep();
  registerConcretePiece();
  registerArrowStep();                         

  show('tray_step3');
  $('tray_step3').style.animation = 'tray_pop_in 600ms ease-out forwards';

  show('spade_step3');
  $('spade_step3').style.animation = 'spade_pop_in 520ms ease-out forwards';

  show('arrow_step3');                         

  after(520, function(){
    const spade = $('spade_step3');
    spade.style.pointerEvents = 'auto';
    spade.onclick = swingSpadeThenShowLump;
  });
}

/* --- Step 5: Filling Logic --- */
function swingSpadeThenShowLump(){
  hide('arrow_step3');
  const spade = $('spade_step3');
  spade.style.pointerEvents = 'none';

  spade.style.animation = 'spade_slide_lr 1.8s ease-in-out forwards';

  spade.addEventListener('animationend', function handler(){
    spade.removeEventListener('animationend', handler);

    dropCount++;
    const pieceId = `piece_${dropCount}`;
    createDropPiece(pieceId);
    show(pieceId);
    
    // Show arrow again for Drop
    show('arrow_step3');

    spade.style.pointerEvents = 'auto';
    spade.onclick = function(){
      dropConcrete(pieceId);
    };
  }, { once: true });
}

function createDropPiece(id){
  if(!$(id)) addActor({ id: id, src: 'images/concrete_piece.png', z: 8 });
  const piece = $(id);
  piece.style.left = '92%';
  piece.style.bottom = '80%';
  piece.style.transform = 'translateX(-50%)';
}

function dropConcrete(pieceId){
  hide('arrow_step3');
  const spade = $('spade_step3');
  const piece = $(pieceId);

  spade.style.pointerEvents = 'none';
  const moveDur = 700;
  spade.style.animation = `spade_move_left ${moveDur}ms ease-out forwards`;
  piece.style.animation = `piece_move_left ${moveDur}ms ease-out forwards`;

  after(moveDur + 50, function(){
    const dropDur = 600;
    piece.style.animation = `piece_drop ${dropDur}ms ease-in forwards`;
    spade.style.animation = `spade_return ${dropDur}ms ease-out forwards`;

    piece.addEventListener('animationend', function handler(){
      piece.removeEventListener('animationend', handler);
      hide(pieceId);
      mergeConcrete(); 
      after(400, startDropCycle);
    }, { once: true });
  });
}

function mergeConcrete() {
  if (dropCount === 1) {
    if(!$('smaller_concrete')){
      addActor({ id: 'smaller_concrete', src: 'images/smaller_concrete.png', z: 7 });
      const el = $('smaller_concrete');
      el.style.left = '50%'; el.style.bottom = '22%'; el.style.transform = 'translateX(-50%)';
    }
    show('smaller_concrete');
  }
  else if (dropCount === 2) {
    hide('smaller_concrete');
    if(!$('middle_concrete')){
      addActor({ id: 'middle_concrete', src: 'images/middle_concrete.png', z: 7 });
      const el = $('middle_concrete');
      el.style.left = '50%'; el.style.bottom = '22%'; el.style.transform = 'translateX(-50%)';
    }
    show('middle_concrete');
  }
  else if (dropCount === 3) {
    hide('middle_concrete');
    if(!$('larger_concrete')){
      addActor({ id: 'larger_concrete', src: 'images/larger_concrete.png', z: 7 });
      const el = $('larger_concrete');
      el.style.left = '50%'; el.style.bottom = '22%'; el.style.transform = 'translateX(-50%)';
    }
    show('larger_concrete');
  }
}

function startDropCycle(){
  const spade = $('spade_step3');
  const arrow = $('arrow_step3');
  const next = $('next_concrete');

  if(dropCount >= MAX_DROPS){
    hide('arrow_step3');
    spade.style.pointerEvents = 'none';

    next.style.pointerEvents = 'auto';
    // UPDATED: Blinking
    next.style.animation = 'next_blink 1.2s infinite ease-in-out';
    next.onclick = showLevelerStep;
    return;
  }

  show('arrow_step3');
  arrow.style.animation = 'none';
  void arrow.offsetWidth; 
  arrow.style.animation = 'arrow_blink 1.1s ease-in-out infinite';

  spade.style.pointerEvents = 'auto';
  spade.onclick = swingSpadeThenShowLump;
}


/* =========================================
   5. LEVELING STAGES
   ========================================= */

function showLevelerStep() {
  setInstruction("step-6"); 

  // DISABLE NEXT while using leveler
  const next = $('next_concrete');
  if(next){
      next.style.animation = '';
      next.style.pointerEvents = 'none';
  }

  registerLeveler();
  registerLevelerArrow();

  show('leveler');
  show('arrow_leveler');
  
  // RESET leveler to starting position
  const leveler = $('leveler');
  leveler.style.transform = 'translateX(-50%) rotate(0deg)'; // Reset to starting position
  leveler.style.left = '25%';
  leveler.style.bottom = '42%';
  leveler.style.animation = '';
  
  $('arrow_leveler').style.animation = 'arrow_leveler_blink 1.2s infinite ease-in-out';
  leveler.style.pointerEvents = 'auto';

  leveler.onclick = function () {
    hide('arrow_leveler');
    leveler.style.pointerEvents = 'none';

    /* 1) MOVE */
    leveler.style.animation = 'leveler_move 1.5s ease-out forwards';
    leveler.addEventListener('animationend', function moveDone(e) {
        if (e.animationName !== 'leveler_move') return;
        leveler.removeEventListener('animationend', moveDone);

        /* 2) SWING - Set the CSS variable first */
        leveler.style.setProperty('--leveler-start-transform', 'translate(250px, -56.8px) rotate(90deg)');
        
        // Now apply the shake animation (8s for 25 shakes)
        leveler.style.animation = 'leveler_shake_25 8.0s ease-in-out forwards';
        
        leveler.addEventListener('animationend', function swingDone(ev) {
            if (ev.animationName !== 'leveler_shake_25') return;
            leveler.removeEventListener('animationend', swingDone);

            convertConcreteToFinal();

            /* 3) RETURN */
            leveler.style.animation = 'leveler_return 1.4s ease-in-out forwards';
        });
    });
  };
}

function convertConcreteToFinal() {
    hide('larger_concrete');
    if(!$('final_concrete')) addActor({ id: 'final_concrete', src: 'images/1.png', z: 8 });
    show('final_concrete');

    // ENABLE NEXT and Blink
    const next = $('next_concrete');
    next.style.pointerEvents = 'auto';
    next.style.animation = 'next_blink 1.2s infinite ease-in-out';
    next.onclick = startFinalSpadeStage;
}

function startFinalSpadeStage() {
    setInstruction("step-7"); 

    const spade = $('spade_step3');   
    const next = $('next_concrete');

    hide('arrow_leveler');
    next.onclick = null;
    next.style.animation = '';
    next.style.pointerEvents = 'none';

    // Show Spade (Static)
    show('spade_step3');
    
    // Show Arrow
    registerArrowStep();
    const arrow = $('arrow_step3');
    arrow.style.left = '92%'; 
    arrow.style.bottom = '86%';
    show('arrow_step3');
    arrow.style.animation = 'arrow_blink 1.1s ease-in-out infinite';

    // Wait for click
    spade.style.pointerEvents = 'auto';
    spade.onclick = performFinalSpadeSwing; 
}

function performFinalSpadeSwing() {
    const spade = $('spade_step3');
    
    hide('arrow_step3');
    spade.style.pointerEvents = 'none';

    spade.style.animation = 'spade_swing_final 1.8s ease-in-out forwards';

    spade.addEventListener('animationend', function doneSwing() {
        spade.removeEventListener('animationend', doneSwing);

        createDropPiece('piece_final');
        show('piece_final');
        show('arrow_step3'); // Show arrow again for 'Drop'

        spade.style.pointerEvents = 'auto';
        spade.onclick = finalDropSequence;
    });
}

function finalDropSequence() {
    hide('arrow_step3');
    const spade = $('spade_step3');
    const piece = $('piece_final');
    spade.style.pointerEvents = 'none';

    spade.style.animation = `spade_move_left 700ms ease-out forwards`;
    piece.style.animation = `piece_move_left 700ms ease-out forwards`;

    after(750, function () {
        piece.style.animation = `piece_drop 600ms ease-in forwards`;
        piece.addEventListener('animationend', function doneDrop() {
            piece.removeEventListener('animationend', doneDrop);
            hide('piece_final');
            convertFinalTo11();
        });
    });
}

function convertFinalTo11() {
    hide('final_concrete');
    if(!$('final_concrete_11')) addActor({ id: 'final_concrete_11', src: 'images/11.png', z: 8 });
    show('final_concrete_11');

    const spade = $('spade_step3');
    spade.style.animation = 'spade_back_to_tray 1.2s ease-out forwards';

    spade.addEventListener('animationend', function goBackDone() {
        spade.removeEventListener('animationend', goBackDone);
        showLevelerFinalStep();
    });
}

function showLevelerFinalStep() {
    setInstruction("step-8");

    registerLeveler();
    registerLevelerArrowFinal();

    show('leveler');
    show('arrow_leveler_final');
    
    // RESET leveler to starting position
    const leveler = $('leveler');
    leveler.style.transform = 'translateX(-50%) rotate(0deg)'; // Reset to starting position
    leveler.style.left = '25%';
    leveler.style.bottom = '42%';
    leveler.style.animation = '';
    
    leveler.style.pointerEvents = 'auto';

    leveler.onclick = function () {
        hide('arrow_leveler_final');
        leveler.style.pointerEvents = 'none';

        /* 1) Move to position first */
        leveler.style.animation = 'leveler_move 1.5s ease-out forwards';
        
        leveler.addEventListener('animationend', function moveDone(e) {
            if (e.animationName !== 'leveler_move') return;
            leveler.removeEventListener('animationend', moveDone);

            /* 2) STROKE 25 TIMES (Updated to 8.0s for realism) */
            leveler.style.setProperty('--leveler-start-transform', 'translate(250px, -20px) rotate(90deg)');
            leveler.style.animation = 'leveler_shake_25 8.0s ease-in-out forwards';

            leveler.addEventListener('animationend', function swingDone(e) {
                if (e.animationName !== 'leveler_shake_25') return;
                leveler.removeEventListener('animationend', swingDone);

                /* 2) Return */
                leveler.style.animation = 'leveler_path_return 1.6s ease-in-out forwards';

                leveler.addEventListener('animationend', function pathDone(ev) {
                    if (ev.animationName !== 'leveler_path_return') return;
                    leveler.removeEventListener('animationend', pathDone);
                    convert11to2();
                });
            });
        });
    };
}

function convert11to2() {
    hide('final_concrete_11');
    if(!$('final_concrete_2')) addActor({ id: 'final_concrete_2', src: 'images/2.png', z: 8 });
    show('final_concrete_2');

    // Enable Next and Blink
    const next = $('next_concrete');
    next.style.pointerEvents = 'auto';
    next.style.animation = 'next_blink 1.2s infinite ease-in-out';
    next.onclick = startFinalSpadeThreeSwings;
}

function startFinalSpadeThreeSwings() {
    setInstruction("step-9");

    const spade = $('spade_step3');
    const next = $('next_concrete');

    next.onclick = null;
    next.style.animation = '';
    next.style.pointerEvents = 'none';

    show('spade_step3');

    registerArrowStep();
    const arrow = $('arrow_step3');
    arrow.style.left = '92%';
    arrow.style.bottom = '86%';
    show('arrow_step3');
    arrow.style.animation = 'arrow_blink 1.1s ease-in-out infinite';

    spade.style.pointerEvents = 'auto';
    spade.onclick = performFinalThreeSwings;
}

function performFinalThreeSwings() {
    const spade = $('spade_step3');

    hide('arrow_step3');
    spade.style.pointerEvents = 'none';

    spade.style.animation = 'spade_swing_three 1.8s ease-in-out forwards';

    spade.addEventListener('animationend', function threeDone() {
        spade.removeEventListener('animationend', threeDone);

        createDropPiece('piece_22');
        show('piece_22');
        show('arrow_step3'); // Show arrow again for 'Drop'

        spade.style.pointerEvents = 'auto';
        spade.onclick = final22DropSequence;
    });
}

function final22DropSequence() {
    hide('arrow_step3');
    const spade = $('spade_step3');
    const piece = $('piece_22');
    spade.style.pointerEvents = 'none';

    spade.style.animation = `spade_move_left 700ms ease-out forwards`;
    piece.style.animation = `piece_move_left 700ms ease-out forwards`;

    after(750, function () {
        piece.style.animation = `piece_drop 600ms ease-in forwards`;
        piece.addEventListener('animationend', function dropDone() {
            piece.removeEventListener('animationend', dropDone);
            hide('piece_22');
            convert2to22();
        });
    });
}

function convert2to22() {
    hide('final_concrete_2');
    if(!$('final_concrete_22')) addActor({ id: 'final_concrete_22', src: 'images/22.png', z: 8 });
    show('final_concrete_22');

    $('next_concrete').onclick = null;
    $('next_concrete').style.pointerEvents = 'none';

    moveSpadeBackToTray();
    after(1200, showLastLevelerStage);
}

function moveSpadeBackToTray() {
    const spade = $('spade_step3');
    spade.style.animation = "none";
    void spade.offsetWidth;
    spade.style.animation = "spade_return_to_tray_final 1.1s ease-out forwards";
}

function showLastLevelerStage() {
    setInstruction("step-10");

    registerLeveler();
    registerLevelerArrowFinal2();

    show('leveler');
    show('arrow_leveler_final2');
    
    // RESET leveler to starting position
    const leveler = $('leveler');
    leveler.style.transform = 'translateX(-50%) rotate(0deg)'; // Reset to starting position
    leveler.style.left = '25%';
    leveler.style.bottom = '42%';
    leveler.style.animation = '';
    
    leveler.style.pointerEvents = 'auto';

    leveler.onclick = function () {
        hide('arrow_leveler_final2');
        leveler.style.pointerEvents = 'none';

        /* 1) FULL MOVE (To position) - Use leveler_move instead of leveler_full_move */
        leveler.style.animation = 'leveler_move 1.5s ease-out forwards';

        leveler.addEventListener('animationend', function step1(e) {
            if (e.animationName !== 'leveler_move') return;
            leveler.removeEventListener('animationend', step1);

            /* 2) STROKE 25 TIMES (Updated to 8.0s) */
            // For the final layer, the leveler should be at a different height
            // Let's adjust the position slightly
            leveler.style.transform = 'translate(250px, -50px) rotate(90deg)';
            leveler.style.setProperty('--leveler-start-transform', 'translate(250px, -153.6px) rotate(90deg)');
            leveler.style.animation = 'leveler_shake_25 8.0s ease-in-out forwards';

            leveler.addEventListener('animationend', function step2(ev) {
                if (ev.animationName !== 'leveler_shake_25') return;
                leveler.removeEventListener('animationend', step2);

                /* 3) RETURN */
                leveler.style.animation = 'leveler_full_return 1.6s ease-in-out forwards';

                leveler.addEventListener('animationend', function step3(ev2) {
                    if (ev2.animationName !== 'leveler_full_return') return;
                    leveler.removeEventListener('animationend', step3);
                    convert22to3();
                });
            });
        });
    };
}

function convert22to3() {
    hide('final_concrete_22');
    if(!$('final_concrete_3')) addActor({ id: 'final_concrete_3', src: 'images/3.png', z: 8 });
    show('final_concrete_3');
    moveConeAndConcrete();
}

function moveConeAndConcrete() {
  setInstruction("step-cone-lift");

    // 1. Show the Arrow
    registerConeArrow(); 
    show('arrow_cone');
    // Ensure animation runs
    $('arrow_cone').style.animation = 'arrow_blink 1.1s ease-in-out infinite';

    const cone = $('cone');
    const leveler = $('leveler');
    
    if (leveler) leveler.style.visibility = "hidden";

    // 2. Make Cone Clickable
    cone.style.pointerEvents = "auto"; 
    cone.style.cursor = "pointer";

    cone.onclick = function() {
        // 3. Hide Arrow immediately on click
        hide('arrow_cone');

        cone.onclick = null;
        cone.style.pointerEvents = "none";
        cone.style.cursor = "default";

        /* CONE ANIMATION: UP -> RIGHT -> DOWN */
        cone.style.animation = "cone_vertical_remove_path 2.5s ease-in-out forwards";

        /* Trigger next step */
        setTimeout(change3to4, 800);
    };
}

function change3to4() {
    hide('final_concrete_3');
    if(!$('final_concrete_4')) addActor({ id: 'final_concrete_4', src: 'images/4.png', z: 8 });
    show('final_concrete_4');
    
    setInstruction("step-11"); 

    const next = $('next_concrete');
    next.style.visibility = 'visible';
    next.style.pointerEvents = 'auto';
    // UPDATED: Blinking
    next.style.animation = 'next_blink 1.2s infinite ease-in-out';
    next.onclick = showScaleImage;
}


/* =========================================
   6. SCALE & MEASUREMENT
   ========================================= */
function showScaleImage() {
    setInstruction("step-12"); 

    registerScale();
    registerArrowScale();

    hide('next_concrete');
    show('scale');
    show('arrow_scale');

    const scale = $('scale');
    scale.style.pointerEvents = "auto";
    scale.onclick = scaleMoveSequence;
}

function scaleMoveSequence() {
    hide('arrow_scale');
    const scale = $('scale');
    scale.style.pointerEvents = "none";

    scale.style.animation = "scale_move_right 1s ease-out forwards";
    scale.addEventListener('animationend', function step1(e){
        if(e.animationName !== "scale_move_right") return;
        scale.removeEventListener('animationend', step1);

        scale.style.animation = "scale_move_down 1.2s ease-in-out forwards";
        scale.addEventListener('animationend', function step2(ev){
          if(ev.animationName !== "scale_move_down") return;
          scale.removeEventListener('animationend', step2);

          registerLevelerMeasure();
          show('leveler_measure');

          showMeasureLines();
        });
    });
}

function showMeasureLines() {
    registerMeasureLines();
    registerMeasureValueLabel();

    // With new CSS, concrete is exactly at 50%
    const leftPos = '50%'; 

    const top = $('measure_line_top');
    top.style.left = leftPos;
    top.style.bottom = '72%';
    top.style.visibility = 'visible';

    const bottom = $('measure_line_bottom');
    bottom.style.left = leftPos;
    bottom.style.bottom = '56.2%';
    bottom.style.visibility = 'visible';

    top.style.animation = 'measure_expand 0.9s ease-out forwards';
    bottom.style.animation = 'measure_expand 0.9s ease-out forwards';

    setTimeout(function(){
        const label = $('measure_value_label');
        label.style.visibility = 'visible';
        label.style.opacity = '1'; 
        
        showFinalInput();
    }, 950);
}

function registerConeArrow() {
  if(!$('arrow_cone')) addActor({ id: 'arrow_cone', src: 'images/arrow.png', z: 20 });
}

function showFinalInput() {
    const box = document.getElementById('instructionBox');
    
    // 1. Set class for yellow styling
    box.className = "step-13"; 
    
    // 2. Inject HTML directly into the Instruction Box
    //    (This replaces the 'popup' behavior)
    box.innerHTML = `
        Note down the height difference<br>
        <div style="margin-top:10px; display:flex; gap:10px; justify-content:flex-start;">
            <input type="text" id="result_input" placeholder="cm" 
                   style="font-size:20px; width:80px; padding:4px; border-radius:4px; border:1px solid #333;">
            <button onclick="checkFinalInput()" 
                    style="font-size:18px; padding:4px 12px; cursor:pointer; background:#333; color:white; border:none; border-radius:4px;">
                OK
            </button>
        </div>
    `;
}

function checkFinalInput() {
    const input = document.getElementById('result_input');
    const val = input.value.trim();

    if (val === "") return; // Do nothing if empty

    // 3. Clear the HTML input
    const box = document.getElementById('instructionBox');
    box.innerHTML = ""; 

    // 4. Switch to the final 'Completed' step text
    setInstruction("step-14"); 
}