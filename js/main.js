let userInfo = { name: "", gender: "", age: "", birthdate: "" };
let currentUserId = null;

$(document).ready(function () {
  $('<span id="greeting"></span>').insertBefore('#loginLink');
  $('<a id="logoutLink" href="#" style="display:none">로그아웃</a>').insertAfter('#loginLink');


  $('.scroll-down').click(() =>
    $('html, body').animate({ scrollTop: $('main').offset().top }, 600)
  );


  $('.scroll-up').click(() =>
    $('html, body').animate({ scrollTop: 0 }, 600)
  );

  $('#loginLink').click(e => {
    e.preventDefault();
    $('#loginModal').fadeIn();
  });


  $('#myInfoLink').click(e => {
    e.preventDefault();
    if (userInfo.name) {
      $('#infoName').text('이름: ' + userInfo.name);
      $('#infoGender').text('성별: ' + (userInfo.gender || ''));
      $('#infoAge').text('나이: ' + (userInfo.age || ''));
      $('#infoBirthdate').text('생년월일: ' + userInfo.birthdate);
    } else {
      $('#infoName').text('로그인 정보가 없습니다.');
      $('#infoGender, #infoAge, #infoBirthdate').text('');
    }
    $('#myInfoModal').fadeIn();
  });


  $('.close').click(function () {
    $(this).closest('.modal').fadeOut();
  });


  $('#saveInfoBtn').click(async e => {
    e.preventDefault();
    await handleAuth();
  });


  $(document).on('click', '#logoutLink', function (e) {
    e.preventDefault();
    handleLogout();
  });
});

async function handleAuth() {
  const name = $('#name').val().trim();
  const gender = $('#gender').val().trim();
  const age = $('#age').val().trim();
  const birthdate = $('#birthdate').val().trim();
  const password = $('#password').val();

  if (!name || !birthdate || !password) {
    alert('이름, 생년월일, 비밀번호는 필수입니다.');
    return;
  }


  userInfo = { name, gender, age, birthdate };

  $('#loginModal').fadeOut();
  $('#loginLink').hide();
  $('#logoutLink').show();
  $('#greeting').text(`안녕하세요, ${name}님!`);
}

function handleLogout() {
  userInfo = { name: "", gender: "", age: "", birthdate: "" };
  $('#greeting').text('');
  $('#loginLink').show();
  $('#logoutLink').hide();
}

//클리어 완료되었습니다 라고 바꾼거
$('#clearMission').click(() => {
  $('.mission-content').html('<h2>완료되었습니다!</h2>');
});
