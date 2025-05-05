document.addEventListener("DOMContentLoaded", function () {
    const questionBoxes = document.querySelectorAll(".question-box");
  
    questionBoxes.forEach(box => {
      const questionId = box.dataset.id;
      const inputs = box.querySelectorAll("input[type='radio'], input[type='checkbox'], input[type='text']");
  
      inputs.forEach(input => {
        input.addEventListener("change", () => {
          const checkBox = document.getElementById(`check-${questionId}`);
          if (checkBox) {
            checkBox.checked = true;
          }
        });
      });
    });
  });
  