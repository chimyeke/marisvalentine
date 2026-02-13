let cards = [];
let config = {};

fetch('config.json')
  .then(r => r.json())
  .then(data => {
    config = data;
    document.documentElement.style.setProperty('--primary', config.primaryColor);
    document.documentElement.style.setProperty('--secondary', config.secondaryColor);

    cards = [
      { isTitle: true },
      ...config.cards
    ];

    renderStack();
    startHearts();

    document.getElementById('contactBtn').onclick = () => {
      window.open(`https://wa.me/${config.whatsapp}?text=Happy%20Valentines%20from%20day%20${encodeURIComponent(config.recipient)}!`, '_blank');
    };
  })
  .catch(err => console.error("Failed to load config", err));

function renderStack() {
  const container = document.getElementById('card-stack');
  container.innerHTML = '';

  cards.forEach((cardData, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.zIndex = cards.length - index;

    let rotateDeg = index === 0 ? 0 : (index % 2 === 0 ? -3 : 3);
    card.style.setProperty('--r', `${rotateDeg}deg`);

    card.innerHTML = `
      <div class="card-inner">
        <div class="front flex items-center justify-center bg-white p-5 sm:p-8 text-center overflow-hidden">
          ${cardData.isTitle
            ? `
              <div class="w-full">
                <div class="happy-val text-5xl sm:text-7xl md:text-8xl text-rose-600 drop-shadow-md mb-2 md:mb-4">
                  Happy Valentines Day
                </div>
                <div class="recipient-name text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 bg-clip-text text-transparent leading-none">
                  ${config.recipient}
                </div>
              </div>
            `
            : `<img src="${cardData.image}" alt="memory" class="h-full w-full object-cover">`
          }
        </div>

        <div class="back flex flex-col items-center justify-center p-6 sm:p-10 text-center">
          <p class="text-rose-800 text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-line max-w-prose font-medium">
            ${cardData.note || "Every moment with you feels like Valentine's Day ♡"}
          </p>
          <div class="mt-6 sm:mt-8 text-rose-400/90 text-sm sm:text-base italic">
            tap anywhere to continue →
          </div>
        </div>
      </div>
    `;

    if (index === 0) {
      card.addEventListener('click', () => {
        if (card.classList.contains('flipped')) {
          nextCard();
        } else {
          card.classList.add('flipped');
        }
      });
    }

    container.appendChild(card);
  });

  requestAnimationFrame(() => {
    const topCard = container.querySelector('.card:first-child');
    if (topCard) {
      topCard.classList.add('entering');
      setTimeout(() => topCard.classList.remove('entering'), 1400);
    }
  });
}

function nextCard() {
  if (cards.length <= 1) return;

  const top = document.querySelector('#card-stack .card');
  if (top) top.classList.remove('flipped');

  const first = cards.shift();
  cards.push(first);

  renderStack();
}

// Hearts (unchanged)
function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.innerHTML = ['❤️','💗','💖','💓','💞'][Math.floor(Math.random()*5)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.bottom = '-10vh';
  heart.style.animationDuration = (Math.random() * 8 + 10) + 's';
  heart.style.fontSize = (Math.random() * 1.2 + 1.6) + 'rem';
  document.getElementById('hearts').appendChild(heart);
  setTimeout(() => heart.remove(), 18000);
}

function startHearts() {
  setInterval(createHeart, 300);
  for(let i = 0; i < 12; i++) setTimeout(createHeart, i * 180);
}
