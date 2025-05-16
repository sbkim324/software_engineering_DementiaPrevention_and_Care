const mapContainer = document.getElementById('map');
const mapOption = {
  center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
  level: 7
};
const map = new kakao.maps.Map(mapContainer, mapOption);

let regionData = [];
const minLevel = 1;
const maxLevel = 14;
const slider = document.getElementById('zoom-slider');
const thumb = document.getElementById('zoom-thumb');

// 지역 데이터 불러오기
async function loadRegionData() {
  try {
    const response = await fetch('json/region.json');
    regionData = await response.json();

    const sidoSelect = document.getElementById('mainRegion');
    regionData.forEach(region => {
      const option = document.createElement('option');
      option.value = region.mainRegion;
      option.textContent = region.mainRegion;
      sidoSelect.appendChild(option);
    });
  } catch (error) {
    alert("지역 데이터를 불러오는데 실패했습니다.");
    console.error(error);
  }
}

// 시/도, 시/군/구 셀렉트 박스 설정
function setupRegionSelect() {
  const sidoSelect = document.getElementById('mainRegion');
  const sigunguSelect = document.getElementById('subRegion');

  sidoSelect.addEventListener('change', () => {
    const selectedSido = sidoSelect.value;
    sigunguSelect.innerHTML = '<option value="">-- 시/군/구 선택 --</option>';

    if (!selectedSido) return;

    const selectedRegion = regionData.find(region => region.mainRegion === selectedSido);
    if (selectedRegion) {
      selectedRegion.subRegion.forEach(gungu => {
        const option = document.createElement('option');
        option.value = gungu.name;
        option.textContent = gungu.name;
        option.setAttribute('data-lat', gungu.lat);
        option.setAttribute('data-lng', gungu.lng);
        sigunguSelect.appendChild(option);
      });
    }
  });

  sigunguSelect.addEventListener('change', () => {
    const selectedOption = sigunguSelect.options[sigunguSelect.selectedIndex];
    const lat = selectedOption.getAttribute('data-lat');
    const lng = selectedOption.getAttribute('data-lng');

    if (lat && lng) {
      const moveLatLng = new kakao.maps.LatLng(parseFloat(lat), parseFloat(lng));
      map.setCenter(moveLatLng);
      map.setLevel(6); // 좀 더 줌인
    }
  });

  sigunguSelect.addEventListener('focus', () => {
    if (!sidoSelect.value) {
      alert("시/도를 먼저 선택해주세요.");
      sigunguSelect.blur();
    }
  });
}

// 확대/축소 슬라이더 위치 갱신
function updateZoomThumb() {
  const level = map.getLevel();
  const percent = (level - minLevel) / (maxLevel - minLevel);
  const sliderHeight = slider.offsetHeight - thumb.offsetHeight;
  thumb.style.top = (percent * sliderHeight) + 'px';
}

// 슬라이더 드래그 이벤트
function setupZoomSlider() {
  let dragging = false;

  thumb.addEventListener('mousedown', function(e) {
    dragging = true;
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    const rect = slider.getBoundingClientRect();
    let y = e.clientY - rect.top - thumb.offsetHeight / 2;
    const sliderHeight = slider.offsetHeight - thumb.offsetHeight;
    y = Math.max(0, Math.min(y, sliderHeight));
    thumb.style.top = y + 'px';
    // 레벨 계산
    const percent = y / sliderHeight;
    const level = Math.round(percent * (maxLevel - minLevel) + minLevel);
    map.setLevel(level);
  });

  document.addEventListener('mouseup', function() {
    dragging = false;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('header ul a');
  const current = location.pathname.split('/').pop();
  navLinks.forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// 확대/축소 버튼 이벤트
function setupZoomButtons() {
  document.getElementById('zoom-in').onclick = function() {
    map.setLevel(map.getLevel() - 1);
  };
  document.getElementById('zoom-out').onclick = function() {
    map.setLevel(map.getLevel() + 1);
  };
}

// 치매센터 마커 및 정보창 로드
function loadCenters() {
  fetch('json/data.json')
    .then(response => response.json())
    .then(json => {
      const centers = json.records;

      centers.forEach(center => {
        const name = center["치매센터명"];
        const addr = center["소재지도로명주소"];
        const lat = parseFloat(center["위도"]);
        const lng = parseFloat(center["경도"]);
        const phone = center["운영기관전화번호"];

        if (!isNaN(lat) && !isNaN(lng)) {
          const markerPosition = new kakao.maps.LatLng(lat, lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            map: map
          });

          const infowindow = new kakao.maps.InfoWindow({
            content: `
              <div style="padding:5px; font-size:13px;">
                <strong>${name}</strong><br/>
                ${addr}<br/>
                ☎ ${phone}
              </div>
            `
          });

          let isOpen = false;
          kakao.maps.event.addListener(marker, 'click', function () {
            if (isOpen) {
              infowindow.close();
              isOpen = false;
            } else {
              infowindow.open(map, marker);
              isOpen = true;
            }
          });
        }
      });
    });
}

// 네비게이션 active 자동 적용
function setActiveNav() {
  const navLinks = document.querySelectorAll('header ul a');
  const current = location.pathname.split('/').pop();
  navLinks.forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 초기화 함수
async function initialize() {
  await loadRegionData();
  setupRegionSelect();
  setupZoomButtons();
  setupZoomSlider();
  kakao.maps.event.addListener(map, 'zoom_changed', updateZoomThumb);
  updateZoomThumb();
  loadCenters();
  setActiveNav();
}

document.addEventListener('DOMContentLoaded', initialize);