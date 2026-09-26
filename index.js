// index.js
// Menyimpan keranjang di localStorage supaya isinya tetap ada
// walau user pindah halaman (index.html <-> cart.html).
// Tapi kalau user benar-benar keluar/menutup website (bukan cuma
// pindah ke cart.html), keranjang akan direset otomatis.

const CART_KEY = 'antreless_cart';
const NAV_FLAG = 'antreless_internal_nav'; // penanda "ini pindah halaman di web sendiri"

/** Ambil isi keranjang dari localStorage */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}

/** Simpan isi keranjang ke localStorage */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/** Kosongkan keranjang total */
function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/** Total jumlah item (bukan jumlah jenis) di keranjang */
function getCartCount(cart) {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

/** Update angka badge di ikon keranjang */
function updateCartBadge() {
  const cart = getCart();
  const count = getCartCount(cart);
  const badge = document.getElementById('cart-count');
  if (!badge) return;

  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.classList.add('show');
  } else {
    badge.textContent = '0';
    badge.classList.remove('show');
  }
}

/** Tambahkan 1 item ke keranjang berdasarkan nama & harga */
function addToCart(name, price, button) {
  const cart = getCart();

  if (cart[name]) {
    cart[name].qty += 1;
  } else {
    cart[name] = { name, price, qty: 1 };
  }

  saveCart(cart);
  updateCartBadge();

  // Feedback singkat di tombol yang diklik: teks & warna berubah sebentar
  if (button) {
    const originalText = button.dataset.originalText || button.textContent;
    button.dataset.originalText = originalText;

    button.textContent = 'Ditambahkan ✓';
    button.classList.add('added');
    button.disabled = true;

    clearTimeout(button._resetTimer);
    button._resetTimer = setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('added');
      button.disabled = false;
    }, 900);
  }
}

/** Tandai bahwa perpindahan halaman berikutnya adalah navigasi internal (misal klik ikon keranjang) */
function markInternalNavigation() {
  sessionStorage.setItem(NAV_FLAG, '1');
}

document.addEventListener('DOMContentLoaded', () => {
  // Kalau halaman ini dibuka lewat navigasi internal (misal balik dari cart.html),
  // konsumsi/reset penandanya supaya tidak "nyangkut".
  if (sessionStorage.getItem(NAV_FLAG)) {
    sessionStorage.removeItem(NAV_FLAG);
  }

  // Set badge sesuai isi keranjang saat halaman pertama dibuka
  updateCartBadge();

  // Pasang event ke semua tombol "Tambahkan Ke Keranjang"
  document.querySelectorAll('.btn-add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      if (!card) return;

      const nameEl = card.querySelector('.card-name');
      const priceEl = card.querySelector('.card-price');
      if (!nameEl || !priceEl) return;

      const name = nameEl.textContent.trim();
      const price = parseInt(priceEl.textContent.replace(/\D/g, ''), 10) || 0;

      addToCart(name, price, btn);
    });
  });

  // Tandai navigasi internal setiap kali user klik link di halaman ini
  // (misalnya tombol keranjang ke cart.html, atau tombol kembali ke login.html)
  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => {
      markInternalNavigation();
    });
  });
});

// Dipanggil browser saat tab/halaman akan ditutup atau di-refresh
window.addEventListener('beforeunload', () => {
  // Kalau BUKAN karena klik link ke halaman lain di web ini,
  // berarti user menutup tab/browser atau keluar dari website -> reset keranjang
  if (!sessionStorage.getItem(NAV_FLAG)) {
    clearCart();
  }
});