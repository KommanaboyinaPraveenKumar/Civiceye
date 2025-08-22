const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async function() {
  const token = localStorage.getItem('civiceye_token');
  const savedUser = JSON.parse(localStorage.getItem('civiceye_user_v1'));
  if (token && savedUser) {
    try {
      const res = await fetch(`${API_BASE}/user/${savedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        showDashboard(user);
      } else {
        localStorage.removeItem('civiceye_token');
        localStorage.removeItem('civiceye_user_v1');
        window.location.href = 'index.html';
      }
    } catch {
      localStorage.removeItem('civiceye_token');
      localStorage.removeItem('civiceye_user_v1');
      window.location.href = 'index.html';
    }
  }
});

function showDashboard(user) {
  if (user.type === 'citizen') {
    window.location.href = 'CitizenDash.html';
  } else if (user.type === 'official') {
    window.location.href = 'OfficialDash.html'; // Placeholder; create this file
  }
}

function logout() {
  localStorage.removeItem('civiceye_token');
  localStorage.removeItem('civiceye_user_v1');
  window.location.href = 'index.html';
}