/* ═══════════════════════════════════════════════════════
   VALENTINE PAGE — script.js
   Pure vanilla JS · No dependencies · Mobile-first logic
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM refs ─── */
  const heartsBg     = document.getElementById('heartsBg');
  const particlesEl  = document.getElementById('particles');
  const btnYes       = document.getElementById('btnYes');
  const btnNo        = document.getElementById('btnNo');
  const buttonWrap   = document.getElementById('buttonWrap');
  const mainCard     = document.getElementById('mainCard');
  const sadcatPortal = document.getElementById('sadcatPortal');
  const celebScreen  = document.getElementById('celebScreen');
  const celebHearts  = document.getElementById('celebHearts');
  const giftScreen   = document.getElementById('giftScreen');

  /* ─── Config ─── */
  const HEART_EMOJIS  = ['💖','💗','💓','💞','💝','🌹','✨'];
  const SADCAT_GIFS   = [
    'SADCAT/sadcat1.gif',
    'SADCAT/sadcat2.gif',
    'SADCAT/sadcat3.gif',
    'SADCAT/sadcat4.gif',
    'SADCAT/sadcat5.gif',
    'SADCAT/sadcat6.gif',
    'SADCAT/sadcat7.gif'
  ];
  
  /* Text messages for each GIF */
  const SADCAT_TEXTS = [
    'Mokaak? 😳',              // sadcat1.gif
    'Dukai ඈ 😓',              // sadcat2.gif
    'Ae oya meema 🥺',         // sadcat3.gif
    'Ane Yes කියන්නකෝ 😫',    // sadcat4.gif
    'මං තරහයි අනේ 🥺',        // sadcat5.gif
    'Please please',           // sadcat6.gif
    'Yes Obapan Babaaa😠'      // sadcat7.gif
  ];

  /* Sadcat history tracking to prevent repeats */
  let sadcatHistory = [];
  const MAX_HISTORY = 3; // Remember last 3 gifs shown

  /* ─── Preload GIFs and images in background ─── */
  (function preloadAssets() {
    // Preload sad cat GIFs - force load into cache
    SADCAT_GIFS.forEach(function(gifPath) {
      const img = new Image();
      img.src = gifPath;
      // Force browser to actually load the image
      img.onload = function() {
        // Image is now cached
      };
    });
    
    // Preload dance.gif for celebration screen
    const danceImg = new Image();
    danceImg.src = 'PNG/dance.gif';
    
    // Preload gift images
    const bouquetImg = new Image();
    bouquetImg.src = 'PNG/Flowerbouque.png';
    
    const giftboxImg = new Image();
    giftboxImg.src = 'PNG/giftbox.png';
    
    const choco1Img = new Image();
    choco1Img.src = 'PNG/choco1.png';
    
    const choco2Img = new Image();
    choco2Img.src = 'PNG/choco2.png';
    
    const envelopeImg = new Image();
    envelopeImg.src = 'PNG/envelope.png';
  })();

  /* ─── 1. Background Floating Hearts ─── */
  (function initFloatingHearts() {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className = 'heart';
      h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

      const leftPct   = Math.random() * 92;            // 0-92 %
      const duration  = 7 + Math.random() * 9;        // 7-16 s
      const delay     = Math.random() * -duration;    // stagger start
      const size      = .7 + Math.random() * .8;      // scale 0.7-1.5

      h.style.left            = leftPct + '%';
      h.style.animationDuration = duration + 's';
      h.style.animationDelay   = delay + 's';
      h.style.fontSize         = (1.0 + Math.random() * 1.2) + 'rem';
      h.style.transform        = 'scale(' + size + ')';

      heartsBg.appendChild(h);
    }
  })();

  /* ─── 2. Background Particles ─── */
  (function initParticles() {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size = 40 + Math.random() * 80;  // 40-120 px
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      p.style.left   = Math.random() * 90 + '%';
      p.style.top    = Math.random() * 90 + '%';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      p.style.animationDelay    = Math.random() * -5 + 's';

      particlesEl.appendChild(p);
    }
  })();

  /* ─── 3. NO Button — jump + sad cat ─── */
  btnNo.addEventListener('click', onNoClick);
  btnNo.addEventListener('touchstart', function (e) {
    e.preventDefault();          // block ghost click
    onNoClick(e);
  }, { passive: false });

  function onNoClick() {
    jumpNoButton();
    showSadCat();
  }

  function jumpNoButton() {
    /* Switch to absolute so it moves inside the card */
    btnNo.style.position = 'absolute';
    btnNo.style.margin   = '0';
    btnNo.style.zIndex   = '10';

    /* Card inner dimensions */
    const cardW = mainCard.offsetWidth;
    const cardH = mainCard.offsetHeight;
    const bw    = btnNo.offsetWidth;
    const bh    = btnNo.offsetHeight;

    /* Get YES button position and dimensions */
    const yesRect = btnYes.getBoundingClientRect();
    const cardRect = mainCard.getBoundingClientRect();
    const yesX = yesRect.left - cardRect.left;
    const yesY = yesRect.top - cardRect.top;
    const yesW = btnYes.offsetWidth;
    const yesH = btnYes.offsetHeight;

    /* Safe margins so button stays fully visible inside the card */
    const pad  = 12;
    const maxX = cardW - bw - pad;
    const maxY = cardH - bh - pad;

    let x, y;
    let attempts = 0;
    const maxAttempts = 50;

    /* Keep trying random positions until we find one that doesn't overlap YES button */
    do {
      x = pad + Math.random() * (maxX - pad);
      y = pad + Math.random() * (maxY - pad);
      attempts++;

      /* Check if NO button would overlap with YES button */
      const noOverlapsYes = !(
        x < yesX + yesW + 10 &&  // +10 for extra spacing
        x + bw > yesX - 10 &&
        y < yesY + yesH + 10 &&
        y + bh > yesY - 10
      );

      if (noOverlapsYes || attempts >= maxAttempts) {
        break;
      }
    } while (true);

    btnNo.style.left = x + 'px';
    btnNo.style.top  = y + 'px';
  }

  /* ─── 4. Sad Cat GIF with improved randomization ─── */
  var sadcatFadeTimer = null;   // holds the pending fadeout timeout

  function getRandomSadcatIndex() {
    // Create array of available indices (0 to 6)
    let availableIndices = [];
    for (let i = 0; i < SADCAT_GIFS.length; i++) {
      availableIndices.push(i);
    }
    
    // Remove indices that are in history (recent gifs)
    availableIndices = availableIndices.filter(function(index) {
      return sadcatHistory.indexOf(index) === -1;
    });
    
    // If all indices are in history (shouldn't happen with MAX_HISTORY < total gifs),
    // just use the oldest one from history
    if (availableIndices.length === 0) {
      availableIndices = [0, 1, 2, 3, 4, 5, 6];
    }
    
    // Pick random index from available ones
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    
    // Add to history
    sadcatHistory.push(randomIndex);
    
    // Keep history at max size
    if (sadcatHistory.length > MAX_HISTORY) {
      sadcatHistory.shift(); // Remove oldest
    }
    
    return randomIndex;
  }

  function showSadCat() {
    /* Kill any previous fadeout timer immediately - ensures fresh 4 second timer */
    if (sadcatFadeTimer !== null) {
      clearTimeout(sadcatFadeTimer);
      sadcatFadeTimer = null;
    }

    /* Hide instantly so we can swap the image cleanly */
    sadcatPortal.classList.remove('visible');

    /* Pick random gif using improved algorithm */
    var randomIndex = getRandomSadcatIndex();
    var gif = SADCAT_GIFS[randomIndex];
    var text = SADCAT_TEXTS[randomIndex];

    /* Position: roughly centered with slight random offset - avoiding YES button */
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var imgW = 120;
    var imgH = 120;

    /* Get YES button position */
    const yesRect = btnYes.getBoundingClientRect();
    const yesX = yesRect.left;
    const yesY = yesRect.top;
    const yesW = btnYes.offsetWidth;
    const yesH = btnYes.offsetHeight;
    
    var sadcatX, sadcatY;
    var attempts = 0;
    const maxAttempts = 50;
    
    /* Keep trying random positions until we find one that doesn't overlap YES button */
    do {
      var offsetX = (Math.random() - .5) * (vw * .3);
      var offsetY = (Math.random() - .5) * (vh * .25);
      
      sadcatX = (vw / 2 - imgW / 2) + offsetX;
      sadcatY = (vh / 2 - imgH / 2) + offsetY;
      
      attempts++;
      
      /* Check if sadcat GIF would overlap with YES button */
      const noOverlap = !(
        sadcatX < yesX + yesW + 20 &&  // +20 for extra spacing
        sadcatX + imgW > yesX - 20 &&
        sadcatY < yesY + yesH + 20 &&
        sadcatY + imgH > yesY - 20
      );
      
      if (noOverlap || attempts >= maxAttempts) {
        break;
      }
    } while (true);

    sadcatPortal.style.left = sadcatX + 'px';
    sadcatPortal.style.top  = sadcatY + 'px';

    /* Remove the old img and text entirely */
    var oldImg = sadcatPortal.querySelector('img');
    if (oldImg) oldImg.remove();
    
    var oldText = sadcatPortal.querySelector('.sadcat-text');
    if (oldText) oldText.remove();

    /* Insert fresh elements using cached images */
    var img = document.createElement('img');
    img.className = 'sadcat-portal__img';
    img.src = gif;
    img.alt = 'Sad cat';

    /* Text element */
    var textElement = document.createElement('div');
    textElement.className = 'sadcat-text';
    textElement.textContent = text;

    sadcatPortal.appendChild(img);
    sadcatPortal.appendChild(textElement);

    /* Reveal after a tiny delay for smoother transition */
    setTimeout(function () {
      sadcatPortal.classList.add('visible');
    }, 30);

    /* Auto-hide after 4 seconds */
    sadcatFadeTimer = setTimeout(function () {
      sadcatPortal.classList.remove('visible');
      sadcatFadeTimer = null;
    }, 4000);
  }

  /* ─── 5. YES Button — Celebration Screen ─── */
  btnYes.addEventListener('click', onYesClick);
  btnYes.addEventListener('touchstart', function (e) {
    e.preventDefault();
    onYesClick(e);
  }, { passive: false });

  function onYesClick() {
    // Immediately hide main card and sad cat portal
    mainCard.style.transition = 'opacity 0.4s ease';
    mainCard.style.opacity = '0';
    mainCard.style.pointerEvents = 'none';
    
    sadcatPortal.classList.remove('visible');
    sadcatPortal.style.display = 'none';
    
    // Show celebration screen after brief delay
    setTimeout(function() {
      mainCard.style.display = 'none';
      celebScreen.classList.add('visible');
      startCelebHeartRain();
      startGlowHearts();
      
      // Enable tap-to-spawn hearts
      celebScreen.addEventListener('click', spawnTapHeart);
      celebScreen.addEventListener('touchstart', function(e) {
        // Don't spawn hearts if clicking the gift button
        if (e.target.id !== 'btnGift') {
          spawnTapHeart(e.touches[0]);
        }
      });
    }, 400);
  }

  /* ─── 5a. Gift Button Click Handler ─── */
  const btnGift = document.getElementById('btnGift');
  btnGift.addEventListener('click', onGiftClick);
  btnGift.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onGiftClick(e);
  }, { passive: false });

  function onGiftClick() {
    // Hide celebration screen
    celebScreen.classList.remove('visible');
    
    setTimeout(function() {
      celebScreen.style.display = 'none';
      
      // Show gift screen and start with bouquet
      giftScreen.classList.add('visible');
      initGiftScreenBackground();
      showBouquet();
    }, 600);
  }

  /* ─── 5b. Gift Screen Background Particles ─── */
  function initGiftScreenBackground() {
    const bgAnimations = document.getElementById('giftBgAnimations');
    const colors = ['#fce4ec', '#f8bbd0', '#f48fb1', '#e8eaf6'];
    
    // Create only 6 small particles to avoid lag
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'gift-particle';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
      particle.style.setProperty('--ty', -(Math.random() * 150 + 50) + 'px');
      particle.style.animationDuration = (4 + Math.random() * 3) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      
      bgAnimations.appendChild(particle);
    }
  }

  /* ─── 5c. Bouquet Sequence ─── */
  const bouquet = document.getElementById('bouquet');
  const bouquetMessage = document.getElementById('bouquetMessage');
  const btnNextGift1 = document.getElementById('btnNextGift1');

  function showBouquet() {
    bouquet.classList.add('show');
    
    setTimeout(function() {
      bouquetMessage.classList.add('show');
    }, 800);
    
    setTimeout(function() {
      btnNextGift1.classList.add('show');
    }, 1500);
  }

  btnNextGift1.addEventListener('click', onNextGift1Click);
  btnNextGift1.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onNextGift1Click(e);
  }, { passive: false });

  function onNextGift1Click() {
    if (!btnNextGift1.classList.contains('show')) return;
    
    // Smoothly fade out button
    btnNextGift1.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    btnNextGift1.style.opacity = '0';
    btnNextGift1.style.transform = 'scale(0.8)';
    
    setTimeout(function() {
      btnNextGift1.classList.remove('show');
      btnNextGift1.style.opacity = '';
      btnNextGift1.style.transform = '';
      
      // Hide bouquet and message
      bouquet.classList.add('vanish');
      bouquetMessage.classList.add('vanish');
      
      setTimeout(function() {
        bouquet.classList.remove('show', 'vanish');
        bouquetMessage.classList.remove('show', 'vanish');
        
        // Show giftbox
        showGiftbox();
      }, 600);
    }, 300);
  }

  /* ─── 5d. Giftbox Sequence ─── */
  const giftbox = document.getElementById('giftbox');
  const messageBox = document.getElementById('messageBox');
  let giftboxReady = false;

  function showGiftbox() {
    giftbox.classList.add('show');
    giftboxReady = false;
    
    setTimeout(function() {
      messageBox.classList.add('show');
    }, 800);
    
    setTimeout(function() {
      giftbox.classList.add('clickable');
      giftboxReady = true;
    }, 1800);
  }

  giftbox.addEventListener('click', onGiftboxClick);
  giftbox.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onGiftboxClick(e);
  }, { passive: false });

  function onGiftboxClick() {
    if (!giftbox.classList.contains('clickable') || !giftboxReady) return;
    
    giftbox.classList.remove('clickable');
    giftboxReady = false;
    
    // Disable all interactions during animation
    giftScreen.style.pointerEvents = 'none';
    
    giftbox.classList.add('jiggle');
    messageBox.classList.add('vanish');
    
    setTimeout(function() {
      giftbox.classList.remove('jiggle');
      giftbox.classList.add('vanish');
      
      /* Create pink mist effect at giftbox location */
      const mist = document.createElement('div');
      mist.className = 'pink-mist';
      const rect = giftbox.getBoundingClientRect();
      const giftScreenRect = giftScreen.getBoundingClientRect();
      mist.style.left = (rect.left - giftScreenRect.left + rect.width / 2 - 100) + 'px';
      mist.style.top = (rect.top - giftScreenRect.top + rect.height / 2 - 100) + 'px';
      document.getElementById('giftContainer').appendChild(mist);
      
      setTimeout(function() {
        if (mist.parentNode) {
          mist.parentNode.removeChild(mist);
        }
      }, 1000);
      
      /* Show choco1 after mist */
      setTimeout(function() {
        giftbox.classList.remove('show', 'vanish', 'clickable');
        messageBox.classList.remove('show', 'vanish');
        giftScreen.style.pointerEvents = 'auto';
        showChoco1();
      }, 800);
    }, 500);
  }

  /* ─── 5e. Choco1 Sequence ─── */
  const choco1 = document.getElementById('choco1');
  const choco1Message = document.getElementById('choco1Message');
  let choco1Ready = false;

  function showChoco1() {
    choco1.classList.add('show');
    choco1Ready = false;
    
    setTimeout(function() {
      choco1Message.classList.add('show');
    }, 800);
    
    setTimeout(function() {
      choco1.classList.add('clickable');
      choco1Ready = true;
    }, 1800);
  }

  choco1.addEventListener('click', onChoco1Click);
  choco1.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onChoco1Click(e);
  }, { passive: false });

  function onChoco1Click() {
    if (!choco1.classList.contains('clickable') || !choco1Ready) return;
    
    choco1.classList.remove('clickable');
    choco1Ready = false;
    
    giftScreen.style.pointerEvents = 'none';
    
    choco1.classList.add('jiggle');
    choco1Message.classList.add('vanish');
    
    setTimeout(function() {
      choco1.classList.remove('jiggle');
      choco1.classList.add('vanish');
      
      /* Create pink mist effect at choco1 location */
      const mist = document.createElement('div');
      mist.className = 'pink-mist';
      const rect = choco1.getBoundingClientRect();
      const giftScreenRect = giftScreen.getBoundingClientRect();
      mist.style.left = (rect.left - giftScreenRect.left + rect.width / 2 - 100) + 'px';
      mist.style.top = (rect.top - giftScreenRect.top + rect.height / 2 - 100) + 'px';
      document.getElementById('giftContainer').appendChild(mist);
      
      setTimeout(function() {
        if (mist.parentNode) {
          mist.parentNode.removeChild(mist);
        }
      }, 1000);
      
      /* Show choco2 after mist */
      setTimeout(function() {
        choco1.classList.remove('show', 'vanish', 'clickable');
        choco1Message.classList.remove('show', 'vanish');
        giftScreen.style.pointerEvents = 'auto';
        showChoco2();
      }, 800);
    }, 500);
  }

  /* ─── 5f. Choco2 Sequence ─── */
  const choco2 = document.getElementById('choco2');
  const choco2Message = document.getElementById('choco2Message');
  let choco2Ready = false;

  function showChoco2() {
    choco2.classList.add('show');
    choco2Ready = false;
    
    setTimeout(function() {
      choco2Message.classList.add('show');
    }, 800);
    
    setTimeout(function() {
      choco2.classList.add('clickable');
      choco2Ready = true;
    }, 1800);
  }

  choco2.addEventListener('click', onChoco2Click);
  choco2.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onChoco2Click(e);
  }, { passive: false });

  function onChoco2Click() {
    if (!choco2.classList.contains('clickable') || !choco2Ready) return;
    
    choco2.classList.remove('clickable');
    choco2Ready = false;
    
    giftScreen.style.pointerEvents = 'none';
    
    choco2.classList.add('jiggle');
    choco2Message.classList.add('vanish');
    
    setTimeout(function() {
      choco2.classList.remove('jiggle');
      choco2.classList.add('vanish');
      
      /* Create pink mist effect at choco2 location */
      const mist = document.createElement('div');
      mist.className = 'pink-mist';
      const rect = choco2.getBoundingClientRect();
      const giftScreenRect = giftScreen.getBoundingClientRect();
      mist.style.left = (rect.left - giftScreenRect.left + rect.width / 2 - 100) + 'px';
      mist.style.top = (rect.top - giftScreenRect.top + rect.height / 2 - 100) + 'px';
      document.getElementById('giftContainer').appendChild(mist);
      
      setTimeout(function() {
        if (mist.parentNode) {
          mist.parentNode.removeChild(mist);
        }
      }, 1000);
      
      /* Show envelope after mist */
      setTimeout(function() {
        choco2.classList.remove('show', 'vanish', 'clickable');
        choco2Message.classList.remove('show', 'vanish');
        giftScreen.style.pointerEvents = 'auto';
        showEnvelope();
      }, 800);
    }, 500);
  }

  /* ─── 5g. Envelope Sequence ─── */
  const envelope = document.getElementById('envelope');
  const envelopeMessage = document.getElementById('envelopeMessage');
  let envelopeReady = false;

  function showEnvelope() {
    envelope.classList.add('show');
    envelopeReady = false;
    
    setTimeout(function() {
      envelopeMessage.classList.add('show');
    }, 800);
    
    setTimeout(function() {
      envelope.classList.add('clickable');
      envelopeReady = true;
    }, 1800);
  }

  envelope.addEventListener('click', onEnvelopeClick);
  envelope.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onEnvelopeClick(e);
  }, { passive: false });

  function onEnvelopeClick() {
    if (!envelope.classList.contains('clickable') || !envelopeReady) return;
    
    envelope.classList.remove('clickable');
    envelopeReady = false;
    
    giftScreen.style.pointerEvents = 'none';
    
    envelope.classList.add('jiggle');
    envelopeMessage.classList.add('vanish');
    
    setTimeout(function() {
      envelope.classList.remove('jiggle');
      envelope.classList.add('vanish');
      
      setTimeout(function() {
        envelope.classList.remove('show', 'vanish', 'clickable');
        envelopeMessage.classList.remove('show', 'vanish');
        giftScreen.style.pointerEvents = 'auto';
        
        showFinalMessage();
      }, 600);
    }, 500);
  }

  /* ─── 5h. Final Message with Typewriter Effect ─── */
  const finalMessage = document.getElementById('finalMessage');
  const loveText = document.getElementById('loveText');

  function showFinalMessage() {
    finalMessage.classList.add('show');
    
    setTimeout(function() {
      typewriterEffect();
    }, 800);
  }

  function typewriterEffect() {
    const text = "මං ඔයාට ගොදාආආආආආආආක්\nආදලෙයි 😚❤️\n\nඋම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්මා ❤️";
    let index = 0;
    
    loveText.classList.add('typing');
    
    const typingInterval = setInterval(function() {
      if (index < text.length) {
        loveText.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(typingInterval);
        loveText.classList.remove('typing');
        
        setTimeout(function() {
          const signature = document.querySelector('.signature');
          if (signature) {
            signature.classList.add('show');
          }
        }, 500);
      }
    }, 80);
  }

  /* ─── 6. Celebration heart rain (continuous) ─── */
  function startCelebHeartRain() {
    let running = true;

    (function rain() {
      if (!running) return;

      const h = document.createElement('div');
      h.className  = 'cheart';
      h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

      const leftPct  = Math.random() * 95;
      const duration = 2.5 + Math.random() * 3.5;

      h.style.left              = leftPct + '%';
      h.style.fontSize          = (1.2 + Math.random() * 1.4) + 'rem';
      h.style.animationDuration = duration + 's';

      celebHearts.appendChild(h);

      h.addEventListener('animationend', function () {
        if (h.parentNode) h.parentNode.removeChild(h);
      });

      setTimeout(rain, 300 + Math.random() * 400);
    })();
  }

  /* ─── 7. Tap-to-spawn hearts on celebration screen ─── */
  function spawnTapHeart(e) {
    const rect = celebScreen.getBoundingClientRect();
    const x = (e.clientX || e.pageX) - rect.left;
    const y = (e.clientY || e.pageY) - rect.top;

    const count = 1;

    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className   = 'tap-heart';
      h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

      const sx = x + (Math.random() - .5) * 20;
      const sy = y + (Math.random() - .5) * 20;

      h.style.left  = sx + 'px';
      h.style.top   = sy + 'px';
      h.style.fontSize = (1.2 + Math.random() * 1.2) + 'rem';
      h.style.animationDelay = (Math.random() * .15) + 's';

      celebScreen.appendChild(h);

      h.addEventListener('animationend', function () {
        if (h.parentNode) h.parentNode.removeChild(h);
      });
    }
  }

  /* ─── 8. Glowing hearts behind dance gif ─── */
  function startGlowHearts() {
    const celebGlowHearts = document.getElementById('celebGlowHearts');
    const celebDanceContainer = document.getElementById('celebDanceContainer');
    const glowHeartEmojis = ['💖', '💗', '💓', '💞', '💝'];
    
    let running = true;
    let activeHearts = 0;
    const MAX_HEARTS = 5;

    (function spawnGlowHeart() {
      if (!running) return;

      if (activeHearts < MAX_HEARTS) {
        const h = document.createElement('div');
        h.className = 'glow-heart';
        h.textContent = glowHeartEmojis[Math.floor(Math.random() * glowHeartEmojis.length)];

        const containerWidth = celebDanceContainer.offsetWidth;
        const containerHeight = celebDanceContainer.offsetHeight;
        
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 50;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        h.style.left = x + 'px';
        h.style.top = y + 'px';
        h.style.fontSize = (1.2 + Math.random() * 1) + 'rem';
        h.style.animationDuration = (3 + Math.random() * 1) + 's';
        h.style.animationDelay = (Math.random() * 0.3) + 's';

        celebGlowHearts.appendChild(h);
        activeHearts++;

        h.addEventListener('animationend', function() {
          if (h.parentNode) h.parentNode.removeChild(h);
          activeHearts--;
        });
      }

      setTimeout(spawnGlowHeart, 600 + Math.random() * 800);
    })();
  }

})();
