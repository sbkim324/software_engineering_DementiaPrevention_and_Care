document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
  
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
  
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
      });
    });
  });
  
  document.addEventListener('DOMContentLoaded', function () {
  const tips = [
    '💡 치매는 예방이 중요해요. 하루 30분 산책 어때요?',
    '📘 퍼즐 맞추기, 독서 등 뇌 자극 활동이 치매 예방에 좋아요.',
    '🍽️ 규칙적인 식사와 수면은 뇌 건강에 중요해요!',
    '💬 가족과 자주 대화하세요. 언어 자극이 기억력에 도움이 됩니다.',
    '🧠 건강한 식습관은 뇌를 지켜줘요. 생선, 견과류, 과일 챙기기!',
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById('daily-info').textContent = randomTip;
});
