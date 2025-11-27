document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mcuForm');
    const messageElement = document.getElementById('message');
    const submitButton = form.querySelector('.btn-submit');

    // !!! URL WEB APP BARU SUDAH DIPERBARUI DI SINI !!!
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwmzbJosB8UR6JdwspkwTJrYDeLq8XBxyC1rTJhT7ZByyHh1LS1ErfJCHr0m-ajf8Ua/exec'; 
    // ----------------------------------------------------------------

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 1. Ambil Nilai dari Input
        const nipNik = document.getElementById('nip_nik').value.trim();
        const namaPeserta = document.getElementById('nama_peserta').value.trim();
        const noHandphone = document.getElementById('no_handphone').value.trim();

        // 2. Validasi Input
        if (nipNik === '' || namaPeserta === '' || noHandphone === '') {
            showMessage('Semua kolom WAJIB diisi!', 'error');
            return;
        }
        const phoneRegex = /^\d{9,15}$/; // Angka 9-15 digit
        if (!phoneRegex.test(noHandphone)) {
            showMessage('Format No Handphone tidak valid (hanya angka, 9-15 digit).', 'error');
            return;
        }
        
        // 3. Persiapan Pengiriman (Loading State)
        submitButton.disabled = true;
        submitButton.textContent = '⏳ Mengirim Data...';
        
        // Buat objek FormData untuk Apps Script
        const formData = new FormData();
        formData.append('nip_nik', nipNik);
        formData.append('nama_peserta', namaPeserta);
        formData.append('no_handphone', noHandphone);

        try {
            // 4. Kirim Data ke Google Apps Script (POST request)
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                 // Jika HTTP status bukan 200 OK (misal 500)
                 throw new Error(`Gagal terhubung ke Google Script. Status: ${response.status}`);
            }
            
            const result = await response.json();

            // 5. Cek Hasil Respon dari Apps Script
            if (result && result.result === 'success') {
                showMessage(`✅ Data berhasil disimpan di baris #${result.row}!`, 'success');
                form.reset(); // Kosongkan formulir setelah sukses
            } else {
                throw new Error('Respon Apps Script tidak memberikan status sukses.');
            }

        } catch (error) {
            console.error('Error saat mengirim data:', error);
            showMessage('❌ Terjadi kesalahan saat menyimpan data. Pastikan ID Sheet dan Deployment Apps Script sudah benar.', 'error');
        } finally {
            // 6. Kembalikan Tombol ke Keadaan Semula
            submitButton.disabled = false;
            submitButton.textContent = '💾 SIMPAN DATA';
        }
    });

    /**
     * Fungsi untuk menampilkan pesan status (sukses/error)
     * @param {string} msg - Pesan yang akan ditampilkan.
     * @param {string} type - Tipe pesan ('success' atau 'error').
     */
    function showMessage(msg, type) {
        messageElement.textContent = msg;
        messageElement.className = 'message-status'; // Reset class
        messageElement.style.display = 'block'; // Tampilkan pesan

        if (type === 'success') {
            // Class CSS untuk sukses
            messageElement.classList.add('success'); 
        } else if (type === 'error') {
            messageElement.classList.add('error');
            // Menambahkan style error inline jika CSS belum mendefinisikannya
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.border = '1px solid #f5c6cb';
        }
        
        // Sembunyikan pesan setelah 5 detik
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
});


