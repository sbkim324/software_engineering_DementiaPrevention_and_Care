document.addEventListener("DOMContentLoaded", function () {
    const questions = [
      "1번 문항 : 최근 기억력이 떨어졌다고 느끼십니까?",
      "2번 문항 : 자신의 기억력에 문제가 있다고 생각하십니까?",
      "3번 문항 : 자신의 기억력이 10년 전보다 나빠졌다고 생각하십니까?",
      "4번 문항 : 기억력 저하로 인해 일상생활에 불편을 느끼십니까?",
      "5번 문항 : 최근에 일어난 일을 기억하는 것이 어렵습니까?",
      "6번 문항 : 며칠 전에 나눈 대화 내용을 기억하기 어렵습니까?",
      "7번 문항 : 며칠 전에 한 약속을 기억하기 어렵습니까?",
      "8번 문항 : 친한 사람의 이름을 기억하기 어렵습니까?",
      "9번 문항 : 물건 둔 곳을 기억하기 어렵습니까?",
      "10번 문항 : 이전에 비해 물건을 자주 잃어버립니까?",
      "11번 문항 : 집 근처에서 길을 잃은 적이 있습니까?",
      "12번 문항 : 가게에서 2-3가지 물건을 사려고 할 때 물건이름을 기억하기 어렵습니까?",
      "13번 문항 : 가스불이나 전기불 끄는 것을 기억하기 어렵습니까?",
      "14번 문항 : 자주 사용하는 전화번호(자신 혹은 자녀의 집)을 기억하기 어렵습니까?"
    ];
  
    const questionsContainer = document.getElementById("questions-container");
    const checklist = document.getElementById("question-checklist");
  
    questions.forEach((text, index) => {
      const id = `q${index + 1}`;
  
      const box = document.createElement("div");
      box.className = "question-box";
      box.dataset.id = id;
  
      const title = document.createElement("div");
      title.className = "question-title";
      title.textContent = text;
  
      const inputArea = document.createElement("div");
      inputArea.className = "options";
      inputArea.innerHTML = `
        <label><input type="radio" name="${id}" value="1"> 예</label>
        <label><input type="radio" name="${id}" value="0"> 아니오</label>
      `;
  
      box.appendChild(title);
      box.appendChild(inputArea);
      questionsContainer.appendChild(box);
  
      const listItem = document.createElement("li");
      listItem.innerHTML = `${index + 1}번 문항 <input type="checkbox" id="check-${id}" />`;
      checklist.appendChild(listItem);
    });
  
    const scoreDisplay = document.getElementById("score-display");
    const radios = document.querySelectorAll("input[type='radio']");
  
    function updateScore() {
      let score = 0;
      radios.forEach(radio => {
        if (radio.checked && radio.value === "1") {
          score++;
        }
      });
      scoreDisplay.textContent = `총점: ${score} / 14`;
    }
  
    radios.forEach(radio => {
      radio.addEventListener("change", e => {
        const questionBox = e.target.closest(".question-box");
        const id = questionBox.dataset.id;
        const checkbox = document.getElementById(`check-${id}`);
        if (checkbox && !checkbox.checked) {
          checkbox.checked = true; // 자동 체크, 단 사용자가 이미 체크한 건 유지됨
        }
        updateScore();
      });
    });
  
    document.getElementById("submit-btn").addEventListener("click", function () {
      let score = 0;
      radios.forEach(radio => {
        if (radio.checked && radio.value === "1") {
          score++;
        }
      });
  
      if (score >= 6) {
        if (confirm(`총점: ${score}점\n인지기능 저하가 의심됩니다.\n치매안심센터로 이동합니다.`)) {
          location.href = "map.html";
        }
      } else {
        alert(`총점: ${score}점\n정상 범위입니다. 홈으로 돌아갑니다.`);
        location.href = "index.html";
      }
    });
  });
  