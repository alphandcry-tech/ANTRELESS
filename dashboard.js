<script>
    /* Tombol checklist: menandai / batal menandai pesanan selesai */
    document.querySelectorAll(".btn-check").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var checked = btn.getAttribute("data-checked") === "true";
        btn.setAttribute("data-checked", checked ? "false" : "true");
        btn.classList.toggle("checked");
      });
    });

    /* Tombol konfirmasi: menghapus semua kartu pesanan dan set total ke 0 */
    document.getElementById("btnConfirm").addEventListener("click", function () {
      document.getElementById("orderGrid").innerHTML = "";
      document.getElementById("totalValue").textContent = "0";
    });
  </script>
