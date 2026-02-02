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