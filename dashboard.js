// dashboard-penjual.js
// - Setiap kotak ceklis di pesanan: ditekan -> muncul centang, ditekan lagi -> hilang lagi.
// - "Total" dihitung otomatis dari harga yang ada di bawah nama setiap makanan pada daftar pesanan.
// - Tombol "Konfirmasi": kalau ditekan, seluruh daftar pesanan (beserta ceklisnya) hilang,
//   Total kembali ke 0, dan tombolnya jadi nonaktif/pudar.

function formatRupiah(number) {
  return number.toLocaleString('id-ID');
}

function getOrderItems() {
  return Array.from(document.querySelectorAll('.order-item'));
}

/** Hitung ulang total dari harga (data-price) semua item pesanan yang masih tampil */
function updateTotal() {
  const totalEl = document.getElementById('total-amount');
  if (!totalEl) return;
  const total = getOrderItems().reduce((sum, item) => {
    const price = parseInt(item.dataset.price, 10) || 0;
    return sum + price;
  }, 0);

  totalEl.textContent = formatRupiah(total);
}

document.addEventListener('DOMContentLoaded', () => {
  const orderList = document.getElementById('order-list');
  const emptyState = document.getElementById('empty-state');
  const confirmBtn = document.getElementById('btn-konfirmasi');

  // Hitung total pertama kali halaman dibuka
  updateTotal();

  // Toggle kotak ceklis pada setiap item pesanan
  document.querySelectorAll('.check-box').forEach((box) => {
    box.addEventListener('click', () => {
      const isChecked = box.classList.toggle('checked');
      box.setAttribute('aria-checked', String(isChecked));
    });
  });

  // Tombol Konfirmasi: kosongkan daftar pesanan & ceklis, reset total, nonaktifkan tombol
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (orderList) {
        orderList.innerHTML = '';
      }
      if (emptyState) {
        emptyState.hidden = false;
      }
      updateTotal();
      confirmBtn.disabled = true;
    });
  }
});