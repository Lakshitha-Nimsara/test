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
  
  /* Text messages for each GIF (sadcat7 has its own specific message) */
  const SADCAT_TEXTS = [
    'Ane baba 🥺',
    'Please say yes',
    'bbyyyyyy🥹',
    'Yes ඔබන්න 😪',
    'මං තරහයි 🥺',
    'Ane baba 🥺',
    'Yes obapan babaaa 😠'  // Specific message for sadcat7.gif
  ];

  /* ─── Preload GIFs in background ─── */
  (function preloadGifs() {
    SADCAT_GIFS.forEach(function(gifPath) {
      const img = new Image();
      img.src = gifPath;
    });
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

  /* ─── 4. Sad Cat GIF ─── */
  var sadcatFadeTimer = null;   // holds the pending fadeout timeout

  function showSadCat() {
    /* Kill any previous fadeout timer immediately */
    if (sadcatFadeTimer !== null) {
      clearTimeout(sadcatFadeTimer);
      sadcatFadeTimer = null;
    }

    /* Hide instantly so we can swap the image cleanly */
    sadcatPortal.classList.remove('visible');

    /* Pick random gif and its corresponding text */
    var randomIndex = Math.floor(Math.random() * SADCAT_GIFS.length);
    var gif = SADCAT_GIFS[randomIndex];
    var text = SADCAT_TEXTS[randomIndex];

    /* Position: roughly centered with slight random offset */
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var imgW = 120;
    var imgH = 120;

    var offsetX = (Math.random() - .5) * (vw * .3);
    var offsetY = (Math.random() - .5) * (vh * .25);

    sadcatPortal.style.left = ((vw / 2 - imgW / 2) + offsetX) + 'px';
    sadcatPortal.style.top  = ((vh / 2 - imgH / 2) + offsetY) + 'px';

    /* Remove the old img and text entirely */
    var oldImg = sadcatPortal.querySelector('img');
    if (oldImg) oldImg.remove();
    
    var oldText = sadcatPortal.querySelector('.sadcat-text');
    if (oldText) oldText.remove();

    /* Create a brand new img — browser ALWAYS loads a new element */
    var newImg = document.createElement('img');
    newImg.className = 'sadcat-portal__img';
    newImg.alt       = 'sad cat';
    
    /* Create text element */
    var textEl = document.createElement('div');
    textEl.className = 'sadcat-text';
    textEl.textContent = text;

    /* Only fade in once the image is actually loaded */
    newImg.onload = function () {
      sadcatPortal.classList.add('visible');

      /* Fade out after 4 s */
      sadcatFadeTimer = setTimeout(function () {
        sadcatPortal.classList.remove('visible');
        sadcatFadeTimer = null;
      }, 4000);
    };

    /* If load fails for any reason, still show after 300ms */
    newImg.onerror = function () {
      sadcatPortal.classList.add('visible');
      sadcatFadeTimer = setTimeout(function () {
        sadcatPortal.classList.remove('visible');
        sadcatFadeTimer = null;
      }, 4000);
    };

    sadcatPortal.appendChild(newImg);
    sadcatPortal.appendChild(textEl);

    /* Set src AFTER appending and attaching handlers */
    newImg.src = gif;
  }

  /* ─── 5. YES Button — celebration ─── */
  btnYes.addEventListener('click', onYesClick);
  btnYes.addEventListener('touchstart', function (e) {
    e.preventDefault();
    onYesClick(e);
  }, { passive: false });

  function onYesClick() {
    /* Smoothly hide the card */
    mainCard.style.transition = 'opacity .4s ease, transform .4s cubic-bezier(.55,.055,.675,1.19)';
    mainCard.style.opacity    = '0';
    mainCard.style.transform  = 'scale(.85)';

    setTimeout(function () {
      mainCard.style.display = 'none';

      /* Show celebration screen */
      celebScreen.classList.add('visible');
      celebScreen.removeAttribute('aria-hidden');

      /* Start celebration heart rain */
      startCelebHeartRain();

      /* Bind tap-to-spawn */
      celebScreen.addEventListener('click',  spawnTapHeart);
      celebScreen.addEventListener('touchstart', function (e) {
        e.preventDefault();
        spawnTapHeart(e.touches ? e.touches[0] : e);
      }, { passive: false });
    }, 450);
  }

  /* ─── 5a. Gift Button Click ─── */
  const btnGift = document.getElementById('btnGift');
  const giftScreen = document.getElementById('giftScreen');
  const giftBgAnimations = document.getElementById('giftBgAnimations');
  
  btnGift.addEventListener('click', onGiftClick);
  btnGift.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onGiftClick(e);
  }, { passive: false });
  
  function onGiftClick() {
    /* Hide celebration screen */
    celebScreen.style.transition = 'opacity .5s ease';
    celebScreen.style.opacity = '0';
    
    setTimeout(function() {
      celebScreen.classList.remove('visible');
      celebScreen.setAttribute('aria-hidden', 'true');
      
      /* Show gift screen */
      giftScreen.classList.add('visible');
      giftScreen.removeAttribute('aria-hidden');
      
      /* Start background animations */
      startGiftBackgroundAnimations();
      
      /* Show first gift (bouquet) */
      setTimeout(function() {
        showBouquet();
      }, 300);
    }, 500);
  }
  
  /* ─── 5b. Gift Background Animations ─── */
  function startGiftBackgroundAnimations() {
    const colors = [
      'rgba(255, 182, 193, 0.6)',  // light pink
      'rgba(255, 105, 180, 0.5)',  // hot pink
      'rgba(255, 192, 203, 0.6)',  // pink
      'rgba(221, 160, 221, 0.5)',  // plum
      'rgba(238, 130, 238, 0.5)'   // violet
    ];
    
    setInterval(function() {
      const particle = document.createElement('div');
      particle.className = 'gift-particle';
      
      const size = 6 + Math.random() * 12;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const tx = (Math.random() - 0.5) * 200;
      const ty = -50 - Math.random() * 100;
      const duration = 3 + Math.random() * 4;
      
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = color;
      particle.style.left = startX + '%';
      particle.style.top = startY + '%';
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      particle.style.animationDuration = duration + 's';
      
      giftBgAnimations.appendChild(particle);
      
      setTimeout(function() {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, duration * 1000);
    }, 200);
  }
  
  /* ─── 5c. Bouquet Sequence ─── */
  const bouquet = document.getElementById('bouquet');
  const bouquetMessage = document.getElementById('bouquetMessage');
  const btnNextGift1 = document.getElementById('btnNextGift1');
  
  function showBouquet() {
    bouquet.classList.add('show');
    
    /* Show bouquet message after bouquet appears */
    setTimeout(function() {
      bouquetMessage.classList.add('show');
    }, 800);
    
    /* Show next button after bouquet fully appears */
    setTimeout(function() {
      btnNextGift1.classList.add('show');
    }, 1200);
  }
  
  btnNextGift1.addEventListener('click', onNextGift1Click);
  btnNextGift1.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onNextGift1Click(e);
  }, { passive: false });
  
  function onNextGift1Click() {
    /* Hide bouquet, message and button */
    bouquet.style.transition = 'opacity .5s ease, transform .5s ease';
    bouquet.style.opacity = '0';
    bouquet.style.transform = 'scale(0.8)';
    btnNextGift1.style.opacity = '0';
    bouquetMessage.classList.add('vanish');
    
    setTimeout(function() {
      bouquet.classList.remove('show');
      btnNextGift1.classList.remove('show');
      bouquetMessage.classList.remove('show', 'vanish');
      bouquet.style.opacity = '';
      bouquet.style.transform = '';
      btnNextGift1.style.opacity = '';
      
      /* Show gift box */
      showGiftBox();
    }, 500);
  }
  
  /* ─── 5d. Gift Box Sequence ─── */
  const giftbox = document.getElementById('giftbox');
  const btnNextGift2 = document.getElementById('btnNextGift2');
  
  function showGiftBox() {
    giftbox.classList.add('show', 'clickable');
    
    /* Show message box after gift box fully appears */
    setTimeout(function() {
      showMessageBox();
    }, 1200);
  }
  
  /* Remove the Next Gift 2 button event listeners - not needed anymore */
  
  /* ─── 5e. Message Box (instruction only) ─── */
  const messageBox = document.getElementById('messageBox');
  
  function showMessageBox() {
    messageBox.classList.add('show');
  }
  
  /* Click handler is now on the giftbox itself */
  giftbox.addEventListener('click', onGiftBoxClick);
  giftbox.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onGiftBoxClick(e);
  }, { passive: false });
  
  function onGiftBoxClick() {
    /* Only respond if giftbox is visible and clickable */
    if (!giftbox.classList.contains('clickable')) return;
    
    /* Remove clickable to prevent multiple clicks */
    giftbox.classList.remove('clickable');
    
    /* Jiggle the giftbox */
    giftbox.classList.add('jiggle');
    
    setTimeout(function() {
      giftbox.classList.remove('jiggle');
      giftbox.classList.add('vanish');
      
      /* Hide message box */
      messageBox.classList.add('vanish');
      
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
      
      /* Show envelope after mist */
      setTimeout(function() {
        giftbox.classList.remove('show', 'vanish', 'clickable');
        messageBox.classList.remove('show', 'vanish');
        showEnvelope();
      }, 800);
    }, 500);
  }
  
  /* ─── 5f. Envelope Sequence ─── */
  const envelope = document.getElementById('envelope');
  const envelopeMessage = document.getElementById('envelopeMessage');
  
  function showEnvelope() {
    envelope.classList.add('show', 'clickable');
    
    /* Show envelope message after envelope fully appears */
    setTimeout(function() {
      envelopeMessage.classList.add('show');
    }, 1200);
  }
  
  envelope.addEventListener('click', onEnvelopeClick);
  envelope.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onEnvelopeClick(e);
  }, { passive: false });
  
  function onEnvelopeClick() {
    /* Only respond if envelope is visible and clickable */
    if (!envelope.classList.contains('clickable')) return;
    
    /* Remove clickable to prevent multiple clicks */
    envelope.classList.remove('clickable');
    
    /* Jiggle animation */
    envelope.classList.add('jiggle');
    
    /* Hide envelope message */
    envelopeMessage.classList.add('vanish');
    
    setTimeout(function() {
      envelope.classList.remove('jiggle');
      envelope.classList.add('vanish');
      
      setTimeout(function() {
        envelope.classList.remove('show', 'vanish', 'clickable');
        envelopeMessage.classList.remove('show', 'vanish');
        
        /* Show final message */
        showFinalMessage();
      }, 600);
    }, 500);
  }
  
  /* ─── 5g. Final Message with Typewriter Effect ─── */
  const finalMessage = document.getElementById('finalMessage');
  const loveText = document.getElementById('loveText');
  
  function showFinalMessage() {
    finalMessage.classList.add('show');
    
    /* Start typewriter effect after note appears */
    setTimeout(function() {
      typewriterEffect();
    }, 800);
  }
  
  function typewriterEffect() {
    const text = "මං ඔයාට ගොදාආආආආආආආක්\nආදලෙයි 😚❤️\n\nඋම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්මා ❤️";
    let index = 0;
    
    /* Add typing class to show cursor */
    loveText.classList.add('typing');
    
    /* Typewriter interval */
    const typingInterval = setInterval(function() {
      if (index < text.length) {
        loveText.textContent += text.charAt(index);
        index++;
      } else {
        /* Typing complete */
        clearInterval(typingInterval);
        loveText.classList.remove('typing');
        
        /* Show signature after typing is complete */
        setTimeout(function() {
          const signature = document.querySelector('.signature');
          if (signature) {
            signature.classList.add('show');
          }
        }, 500);
      }
    }, 80); /* Speed: 80ms per character - adjust for faster/slower typing */
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
      const duration = 2.5 + Math.random() * 3.5;  // 2.5-6 s

      h.style.left              = leftPct + '%';
      h.style.fontSize          = (1.2 + Math.random() * 1.4) + 'rem';
      h.style.animationDuration = duration + 's';

      celebHearts.appendChild(h);

      /* Remove node after animation ends */
      h.addEventListener('animationend', function () {
        if (h.parentNode) h.parentNode.removeChild(h);
      });

      /* Schedule next heart */
      setTimeout(rain, 300 + Math.random() * 400);
    })();
  }

  /* ─── 7. Tap-to-spawn hearts on celebration screen ─── */
  function spawnTapHeart(e) {
    const rect = celebScreen.getBoundingClientRect();
    const x = (e.clientX || e.pageX) - rect.left;
    const y = (e.clientY || e.pageY) - rect.top;

    const count = 3 + Math.floor(Math.random() * 4);  // 3-6 hearts per tap

    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className   = 'tap-heart';
      h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

      /* Slight spread */
      const sx = x + (Math.random() - .5) * 60;
      const sy = y + (Math.random() - .5) * 40;

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

})();