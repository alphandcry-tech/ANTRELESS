// succes.js
// Saat tombol "Continue Shopping" ditekan, kosongkan keranjang
// supaya qty di cart.html dan angka di badge keranjang balik ke 0.
// (Menambahkan menu baru lagi tetap bisa seperti biasa setelah ini.)

const CART_KEY = 'antreless_cart';

document.addEventListener('DOMContentLoaded', () => {
  const btnContinue = document.querySelector('.btn-continue');
  if (!btnContinue) return;

  btnContinue.addEventListener('click', () => {
    localStorage.removeItem(CART_KEY);
    // Tidak perlu preventDefault, link tetap lanjut ke index.html seperti biasa
  });
});
// registrasi.js
// - Semua input bisa diketik biasa (tidak ada yang di-disable).
// - Icon centang (kotak persetujuan) hanya jadi kotak kosong kalau belum ditekan,
//   dan baru muncul centang + warna kalau ditekan (toggle setiap diklik).
// - Saat tombol "Konfirmasi" ditekan, form tidak reload, tapi diarahkan kembali ke login.html.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrasi-form');
  const agreeCheckbox = document.getElementById('agree-checkbox');

  // Toggle tampil/sembunyikan untuk setiap input password (bisa lebih dari satu di halaman ini)
  document.querySelectorAll('.btn-eye').forEach((btn) => {
    const targetId = btn.dataset.target;
     const input = targetId ? document.getElementById(targetId) : null;
    if (!input) return;

    btn.addEventListener('click', () => {
      const isVisible = input.type === 'text';

      input.type = isVisible ? 'password' : 'text';
      btn.classList.toggle('is-visible', !isVisible);
      btn.setAttribute('aria-pressed', String(!isVisible));
      btn.setAttribute(
        'aria-label',
        isVisible ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi'
      );
    });
  });

  // Toggle kotak centang persetujuan (default kosong, baru centang kalau ditekan)
  if (agreeCheckbox) {
    agreeCheckbox.addEventListener('click', () => {
      const isChecked = agreeCheckbox.classList.toggle('checked');
      agreeCheckbox.setAttribute('aria-checked', String(isChecked));
    });
  }

  // Submit form -> kembali ke halaman login
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  }
});