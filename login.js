// login.js
// - Tombol "eagle eye" untuk menampilkan/menyembunyikan kata sandi
// - Saat form submit (tombol "Masuk ke Akun" ditekan), langsung diarahkan ke index.html
//   sehingga index.html menjadi halaman pertama yang efektif dilihat user setelah login.

document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('toggle-password');
  const form = document.getElementById('login-form');

  // Toggle tampil/sembunyikan kata sandi
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isVisible = passwordInput.type === 'text';

      passwordInput.type = isVisible ? 'password' : 'text';
      toggleBtn.classList.toggle('is-visible', !isVisible);
      toggleBtn.setAttribute('aria-pressed', String(!isVisible));
      toggleBtn.setAttribute(
        'aria-label',
        isVisible ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi'
      );
    });
  }

  // Submit form -> arahkan ke index.html
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }
});