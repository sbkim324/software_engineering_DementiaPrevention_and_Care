import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBW4drkf71w-gE4kQGE1OSBCgCWiSFPWuw",
  authDomain: "remember-1e8cb.firebaseapp.com",
  projectId: "remember-1e8cb",
  storageBucket: "remember-1e8cb.appspot.com",
  messagingSenderId: "658811075569",
  appId: "1:658811075569:web:499223c5debb5e48c0e250"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function refreshUI() {
  if (userInfo.name) {
    $('#greeting').text('사용자 ' + userInfo.name + ' 님').show();
    $('#loginLink').hide();
    $('#logoutLink').show();
  } else {
    $('#greeting').hide();
    $('#loginLink').show();
    $('#logoutLink').hide();
  }
}

(async () => {
  const stored = localStorage.getItem('userDocId');
  if (stored) {
    const snap = await getDoc(doc(db, 'users', stored));
    if (snap.exists()) {
      Object.assign(userInfo, snap.data());
      currentUserId = stored;
      refreshUI();
    } else {
      localStorage.removeItem('userDocId');
    }
  }
})();

window.handleAuth = async function () {
  const name = $('#name').val().trim();
  const gender = $('#gender').val().trim();
  const age = $('#age').val().trim();
  const birthdate = $('#birthdate').val().trim();
  const password = $('#password').val();

  if (!name || !birthdate || !password) {
    alert('이름·생년월일·비밀번호는 필수입니다.');
    return;
  }

  const pwHash = await sha256(password);
  try {
    const q = query(collection(db, 'users'), where('name', '==', name), where('birthdate', '==', birthdate));
    const qs = await getDocs(q);
    if (qs.empty) {
      const ref = await addDoc(collection(db, 'users'), { name, gender, age, birthdate, passwordHash: pwHash });
      currentUserId = ref.id;
      localStorage.setItem('userDocId', ref.id);
    } else {
      const docSnap = qs.docs[0];
      const data = docSnap.data();
      if (data.passwordHash !== pwHash) {
        alert('비밀번호가 틀렸습니다.');
        return;
      }
      currentUserId = docSnap.id;
      localStorage.setItem('userDocId', docSnap.id);
    }
    userInfo = { name, gender, age, birthdate };
    refreshUI();
    $('#loginModal').fadeOut();
  } catch (err) {
    console.error(err);
    alert('로그인/가입 중 오류가 발생했습니다.');
  }
};

window.handleLogout = function () {
  localStorage.removeItem('userDocId');
  userInfo = { name: "", gender: "", age: "", birthdate: "" };
  currentUserId = null;
  refreshUI();
};
