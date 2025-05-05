const title = document.getElementById('Tname');
const stBtn = document.getElementById('startBtn');
const chooseImage = document.getElementById('chooseImage');
const gameBoard = document.getElementById('gameBoard');
const difficulty = document.getElementById('difficulty');
const timer = document.getElementById('timer');
const resetBtn = document.getElementById('resetBtn');
const hintBtn = document.getElementById('hintBtn');
const fireworks = document.getElementById('fireworks');
const setupPanel = document.getElementById('setupPanel');
const resultMessage = document.getElementById('resultMessage');
const infoMessage = document.getElementById('info');

let gameStarted = false;
let firstCard = null;
let lockBoard = false;
let matched = 0;
let imageSet = [];
let hintCount = 0;
let countdown;
let totalSecond;

stBtn.addEventListener('click', () => {
  const files = chooseImage.files;

  if(files.length !== 6) {
    alert('정확히 6장의 사진을 입력해주세요.');
    return;
  }

  imageSet = [];
  for(let i = 0; i < 6; i++) {
  const url = URL.createObjectURL(files[i]);
  imageSet.push(url, url);
  }

  hintCount = 0;
  setupPanel.style.display = 'none';
  resultMessage.style.display = 'none';

  startGame();
});

// 힌트 버튼: 카드 3초간 공개, 최대 2회 제한
hintBtn.addEventListener('click', () => {
  if(hintCount >= 2) {
    alert('힌트는 최대 2회까지만 사용 가능합니다.');
    return;
  }
  hintCount++;

  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => card.classList.add('flipped'));

  setTimeout(() => {
    allCards.forEach(card => {
      if(!card.dataset.matched) card.classList.remove('flipped');
    });
  }, 3000);
});

// 리셋 버튼: 게임 상태 초기화
resetBtn.addEventListener('click', () => {
  if(imageSet.length === 0) {
    alert('이미지를 먼저 입력해주세요.');
    return;
  }

  resetBtn.classList.remove('highlight');
  hintCount = 0;
  resultMessage.style.display = 'none';
  startGame();
});

// 게임 시작
function startGame() {
  gameStarted = true;
  clearInterval(countdown);
  totalSecond = parseInt(difficulty.value);
  timer.textContent = `남은 시간: ${totalSecond}초`;
  hintCount = 0;
  matched = 0;
  firstCard = null;
  lockBoard = true;
  gameBoard.innerHTML = ``;
  gameBoard.style.display = 'grid';
  fireworks.style.display = 'none';
  resetBtn.style.display = 'inline-block';
  hintBtn.style.display = 'inline-block';

  const shuffleImages = [...imageSet].sort(() => Math.random() - 0.5);

  // 카드 생성
  shuffleImages.forEach(imgSrc => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back" style="background-image: url('${imgSrc}')"></div></div>`;
    card.dataset.image = imgSrc;
    card.addEventListener('click', () => flipCard(card, imgSrc));
    gameBoard.appendChild(card);
  });

  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => card.classList.add('flipped'));
  setTimeout(() => {
    allCards.forEach(card => card.classList.remove('flipped'));
    lockBoard = false;
    startTimer();
  }, 3000);
}

// 카드 클릭 처리
function flipCard(card, imgSrc) {
  if (lockBoard || card.classList.contains('flipped')) return;

  card.classList.add('flipped');

  if (!firstCard) {
    // 첫 카드 저장
    firstCard = { card, imgSrc };
  } else {
    // 두 번째 카드 비교
    lockBoard = true;

    if (firstCard.imgSrc === imgSrc) {
      // 일치 → 고정
      matched++;
      card.dataset.matched = true;
      firstCard.card.dataset.matched = true;
      firstCard = null;
      lockBoard = false;

      // 게임 클리어 조건
      if (matched === 6) {
        clearInterval(countdown);
        showClearMessage();
      }
    } else {
      // 불일치 → 잠깐 보여주고 다시 닫기
      setTimeout(() => {
        card.classList.remove('flipped');
        firstCard.card.classList.remove('flipped');
        firstCard = null;
        lockBoard = false;
      }, 800);
    }
  }
}

// 타이머 시작
function startTimer() {
  countdown = setInterval(() => {
    totalSecond--;
    timer.textContent = `남은 시간: ${totalSecond}초`;

    if (totalSecond <= 0) {
      clearInterval(countdown);
      gameBoard.style.display = 'none';
      hintBtn.style.display = 'none';
      infoMessage.style.display = 'block';
      alert('시간 초과! 다시 시도해보세요.');
      document.querySelectorAll('.card').forEach(c => c.style.pointerEvents = 'none');
      resetBtn.classList.add('highlight');
    }
  }, 1000);
}

// 클리어 메시지 및 폭죽 출력
function showClearMessage() {
  gameBoard.style.display = 'none';
  resultMessage.style.display = 'block';
  resetBtn.classList.remove('highlight');
  hintBtn.style.display = 'none';
  launchFireworks();
}

// 폭죽 애니메이션
function launchFireworks() {
  const canvas = fireworks;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  let particles = [];

  // 불꽃 파티클 생성
  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2;
    for (let i = 0; i < 100; i++) {
      particles.push({
        x, y,
        radius: Math.random() * 3 + 2,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 3 + 2,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }

  // 애니메이션 루프
  function animateFireworks() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      const vx = Math.cos(p.angle) * p.speed;
      const vy = Math.sin(p.angle) * p.speed;
      p.x += vx;
      p.y += vy;
      p.alpha -= p.decay;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${p.alpha})`;
      ctx.fill();

      if (p.alpha <= 0) particles.splice(i, 1);
    });

    if (particles.length > 0) {
      requestAnimationFrame(animateFireworks);
    } else {
      if (!canvas._secondExplosionDone) {
        setTimeout(() => {
          canvas._secondExplosionDone = true;
          createFirework();
          animateFireworks();
        }, 100);
        } else{
        setTimeout(() =>{canvas.style.display = 'none';
        canvas._secondExplosionDone = false; 
        }, 1500);
      }
    }
  }

  createFirework();
  animateFireworks();
}