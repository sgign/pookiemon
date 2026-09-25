/* =========================
   GET HTML ELEMENTS
========================= */

const pack = document.getElementById("pack");
const packScreen = document.getElementById("pack-screen");
const revealScreen = document.getElementById("reveal-screen");
const deckScreen = document.getElementById("deck-screen");

const revealCards = document.querySelectorAll(".reveal-card");
const deckCards = document.querySelectorAll(".deck-card");

const instruction = document.getElementById("reveal-instruction");
const deck = document.getElementById("deck");

let currentCard = 0;
let opened = false;
let inspectingCard = null;


/* =========================
   OPEN PACK
========================= */

pack.addEventListener("click", () => {

  if (opened) return;

  opened = true;

  /* Reset any tilt before animation */
  pack.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";

  /* Shake the pack */
  pack.classList.add("shake");


  /* After shaking, open the pack */
  setTimeout(() => {

    pack.classList.remove("shake");

    pack.classList.add("open");

  }, 500);


  /* Move to card reveal screen */
  setTimeout(() => {

    packScreen.classList.add("hidden");

    revealScreen.classList.remove("hidden");

    setupFirstCard();

  }, 1200);

});


/* =========================
   SET UP FIRST CARD
========================= */

function setupFirstCard() {

  revealCards.forEach((card, index) => {

    if (index === 0) {

      card.classList.add("active");

    } else {

      card.classList.add("waiting");

    }

  });

}


/* =========================
   CARD CLICK
========================= */

revealCards.forEach((card, index) => {

  card.addEventListener("click", (e) => {

    e.stopPropagation();

    /* Only allow the current card to be clicked */
    if (index !== currentCard) return;

    revealNextCard();

  });

});


/* =========================
   REVEAL NEXT CARD
========================= */

function revealNextCard() {

  const current = revealCards[currentCard];

  /* Move current card away */
  current.classList.remove("active");

  current.classList.add("revealed");

  currentCard++;


  /* If there are still cards */
  if (currentCard < revealCards.length) {

    const next = revealCards[currentCard];

    next.classList.remove("waiting");

    next.classList.add("active");

  }

  /* All cards have been revealed */
  else {

    setTimeout(() => {

      revealScreen.classList.add("hidden");

      deckScreen.classList.remove("hidden");

    }, 700);

  }

}


/* =========================
   CARD TILT
========================= */

function addTilt(card) {

  /* Desktop mouse */
  card.addEventListener("mousemove", (e) => {

    tiltCard(
      card,
      e.clientX,
      e.clientY
    );

  });


  /* Mobile touch */
  card.addEventListener(
    "touchmove",
    (e) => {

      const touch = e.touches[0];

      tiltCard(
        card,
        touch.clientX,
        touch.clientY
      );

    },
    { passive: true }
  );


  /* Reset desktop */
  card.addEventListener("mouseleave", () => {

    resetCard(card);

  });


  /* Reset mobile */
  card.addEventListener("touchend", () => {

    resetCard(card);

  });

}


/* =========================
   CALCULATE CARD TILT
========================= */

function tiltCard(card, mouseX, mouseY) {

  const rect = card.getBoundingClientRect();

  const x = mouseX - rect.left;
  const y = mouseY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;


  /* How much the card rotates */
  const rotateY =
    ((x - centerX) / centerX) * 14;

  const rotateX =
    -((y - centerY) / centerY) * 14;


  /* Position for holographic effect */
  const percentX =
    (x / rect.width) * 100;

  const percentY =
    (y / rect.height) * 100;


  /* Apply 3D rotation */
  card.style.transform =
    `perspective(1000px)
     rotateX(${rotateX}deg)
     rotateY(${rotateY}deg)
     scale(1.04)`;


  /* Move rainbow holo */
  const holo = card.querySelector(".holo");

  if (holo) {

    holo.style.backgroundPosition =
      `${percentX}% ${percentY}%`;

  }


  /* Move white glare */
  const glare = card.querySelector(".glare");

  if (glare) {

    glare.style.background =
      `radial-gradient(
        circle at ${percentX}% ${percentY}%,
        rgba(255,255,255,0.5) 0%,
        rgba(255,255,255,0) 70%
      )`;

  }

}


/* =========================
   RESET CARD
========================= */

function resetCard(card) {

  card.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";

}


/* =========================
   ENABLE CARD TILT
========================= */

revealCards.forEach((card) => {

  addTilt(card);

});


/* =========================
   PACK TILT
========================= */

function tiltPack(x, y) {

  const rect = pack.getBoundingClientRect();

  const percentX =
    (x - rect.left) / rect.width;

  const percentY =
    (y - rect.top) / rect.height;


  /* Maximum pack rotation */
  const rotateY =
    (percentX - 0.5) * 18;

  const rotateX =
    -(percentY - 0.5) * 18;


  /* Get shine elements */
  const shine =
    pack.querySelector(".pack-shine");

  const glare =
    pack.querySelector(".pack-glare");


  /* Move rainbow shine */
  if (shine) {

    shine.style.backgroundPosition =
      `${percentX * 100}% ${percentY * 100}%`;

  }


  /* Move white glare */
  if (glare) {

    glare.style.background =
      `radial-gradient(
        circle at ${percentX * 100}% ${percentY * 100}%,
        rgba(255,255,255,0.55) 0%,
        rgba(255,255,255,0.15) 25%,
        transparent 65%
      )`;

  }


  /* Apply 3D tilt */
  pack.style.transform =
    `perspective(1000px)
     rotateX(${rotateX}deg)
     rotateY(${rotateY}deg)
     scale(1.04)`;

}


/* =========================
   PACK MOUSE TILT
========================= */

pack.addEventListener("mousemove", (e) => {

  if (opened) return;

  tiltPack(
    e.clientX,
    e.clientY
  );

});


/* Reset pack when mouse leaves */

pack.addEventListener("mouseleave", () => {

  if (opened) return;

  pack.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";

});


/* =========================
   PACK TOUCH TILT
========================= */

pack.addEventListener(
  "touchmove",
  (e) => {

    if (opened) return;

    const touch = e.touches[0];

    tiltPack(
      touch.clientX,
      touch.clientY
    );

  },
  { passive: true }
);


/* Reset pack after touching */

pack.addEventListener("touchend", () => {

  if (opened) return;

  pack.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";

});


/* =========================
   FINAL DECK CARD INSPECTION
========================= */


/* Add tilt + click to final deck cards */

deckCards.forEach((card) => {

  /* Enable tilt */
  addTilt(card);


  /* Click card to inspect */
  card.addEventListener("click", (e) => {

    e.stopPropagation();


    /* If this card is already being inspected,
       clicking it again closes inspection */

    if (card === inspectingCard) {

      closeInspection();

      return;

    }


    /* Inspect this card */

    inspectCard(card);

  });

});


/* =========================
   INSPECT CARD
========================= */

function inspectCard(card) {

  /* Remove inspecting state from all cards */

  deckCards.forEach((otherCard) => {

    otherCard.classList.remove("inspecting");

  });


  /* Mark selected card */

  card.classList.add("inspecting");


  /* Tell deck that a card is being inspected */

  deck.classList.add("has-inspected-card");


  /* Darken background */

  deckScreen.classList.add("inspecting-mode");


  /* Remember which card is being inspected */

  inspectingCard = card;


  /* Reset tilt */

  card.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";

}


/* =========================
   CLOSE INSPECTION
========================= */

function closeInspection() {

  if (!inspectingCard) return;


  /* Remove inspection */

  inspectingCard.classList.remove("inspecting");


  /* Reset card */

  inspectingCard.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";


  /* Restore deck */

  deck.classList.remove("has-inspected-card");

  deckScreen.classList.remove("inspecting-mode");


  /* Clear selected card */

  inspectingCard = null;

}


/* =========================
   CLICK OUTSIDE TO CLOSE
========================= */

deckScreen.addEventListener("click", (e) => {

  if (
    inspectingCard &&
    !e.target.closest(".deck-card")
  ) {

    closeInspection();

  }

});