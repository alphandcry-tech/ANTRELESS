// cart.js
// Mengatur logika halaman Keranjang / Konfirmasi Pesanan (cart.html)
// Menggunakan localStorage yang sama dengan index.js supaya data
// keranjang yang ditambahkan di halaman 1 muncul di halaman ini.
// Kalau user keluar/menutup website dari halaman ini, keranjang direset juga.

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
function clearrCart() {
  localStorage.removeItem(CART_KEY);
}

/** Format angka jadi format ribuan ala Indonesia (10000 -> "10.000") */
function formatPrice(num) {
  return num.toLocaleString('id-ID');
}

/** Hitung ulang total harga dari semua order-card, lalu tampilkan */
function updateTotal() {
  const cards = document.querySelectorAll('.order-card');
  let total = 0;

  cards.forEach((card) => {
    const price = parseInt(card.dataset.price, 10) || 0;
    const qtyInput = card.querySelector('.qty');
    const qty = parseInt(qtyInput.value, 10) || 0;
    total += price * qty;
  });

  const totalEl = document.getElementById('totalValue');
  if (totalEl) totalEl.textContent = formatPrice(total);
}

/** Simpan qty terbaru dari satu kartu ke localStorage */
function syncCardToCart(card) {
  const cart = getCart();
  const name = card.querySelector('.order-name').textContent.trim();
  const price = parseInt(card.dataset.price, 10) || 0;
  const qty = parseInt(card.querySelector('.qty').value, 10) || 0;

  if (qty > 0) {
    cart[name] = { name, price, qty };
  } else {
    // Kalau qty jadi 0, hapus item itu dari keranjang
    delete cart[name];
  }

  saveCart(cart);
}

/** Saat halaman dibuka, isi angka qty setiap kartu sesuai localStorage */
function loadCartIntoCards() {
  const cart = getCart();

  document.querySelectorAll('.order-card').forEach((card) => {
    const name = card.querySelector('.order-name').textContent.trim();
    const qtyInput = card.querySelector('.qty');
    qtyInput.value = cart[name] ? cart[name].qty : 0;
  });
}

/** Tandai bahwa perpindahan halaman berikutnya adalah navigasi internal (misal klik tombol kembali) */
function markInternalNavigation() {
  sessionStorage.setItem(NAV_FLAG, '1');
}

document.addEventListener('DOMContentLoaded', () => {
  // Kalau halaman ini dibuka lewat navigasi internal (misal dari index.html),
  // konsumsi/reset penandanya supaya tidak "nyangkut".
  if (sessionStorage.getItem(NAV_FLAG)) {
    sessionStorage.removeItem(NAV_FLAG);
  }

  // 1. Muat qty yang sudah tersimpan (misal dari halaman 1)
  loadCartIntoCards();
  // 2. Hitung total awal
  updateTotal();

  // 3. Pasang event tombol + dan - di tiap kartu pesanan
  document.querySelectorAll('.order-card').forEach((card) => {
    const qtyInput = card.querySelector('.qty');
    const btnPlus = card.querySelector('.btn-plus');
    const btnMinus = card.querySelector('.btn-minus');

    btnPlus.addEventListener('click', () => {
      const current = parseInt(qtyInput.value, 10) || 0;
      qtyInput.value = current + 1;
      syncCardToCart(card);
      updateTotal();
    });

    btnMinus.addEventListener('click', () => {
      const current = parseInt(qtyInput.value, 10) || 0;
      if (current > 0) {
        qtyInput.value = current - 1;
        syncCardToCart(card);
        updateTotal();
      }
    });
  });

  // 4. Tandai navigasi internal setiap kali user klik link di halaman ini
  // (misal tombol kembali ke index.html, atau tombol "Bayar" ke succes.html)
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