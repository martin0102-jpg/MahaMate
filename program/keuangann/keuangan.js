// ============================================================
// PROGRAM KEUANGAN - MAHAMATE
// ============================================================
// 1. UTILITY FUNCTIONS
// 2. DATA FUNCTIONS (LocalStorage)
// 3. DOM FUNCTIONS (Render UI)
// 4. LOGIC FUNCTIONS
// 5. EVENT LISTENERS
// 6. INITIALIZATION
// ============================================================

// ============================================================
// 1. UTILITY FUNCTIONS
// ============================================================

/**
 * Format angka menjadi Rupiah
 */
function formatRupiah(angka) {
    if (!angka || isNaN(angka)) return 'Rp 0';
    return 'Rp ' + angka.toLocaleString('id-ID');
}

/**
 * Parse string Rupiah menjadi number
 */
function parseRupiah(str) {
    if (!str) return 0;
    var cleaned = str.replace(/Rp\s?/g, '').replace(/\./g, '');
    var num = parseInt(cleaned);
    return isNaN(num) ? 0 : num;
}

/**
 * Format tanggal ke string lokal (DD/MM/YYYY)
 */
function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    var parts = dateStr.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

/**
 * Dapatkan tanggal hari ini dalam format YYYY-MM-DD
 */
function getToday() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

/**
 * Hitung selisih hari antara dua tanggal
 */
function hitungHari(startDate, endDate) {
    if (!startDate) return 0;
    var start = new Date(startDate);
    var end = new Date(endDate);
    var diffTime = Math.abs(end - start);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
}

/**
 * Buat ID unik untuk setiap item
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Tampilkan toast notification
 */
function showToast(message, type) {
    var toast = document.getElementById('toastMessage');
    var colors = {
        success: '#1B4D3E',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0d6efd'
    };
    toast.textContent = message;
    toast.style.borderLeftColor = colors[type] || colors.info;
    toast.className = 'show';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.className = '';
    }, 2500);
}

// ============================================================
// 2. DATA FUNCTIONS (LocalStorage)
// ============================================================

function getStorageKey(bulan, tahun) {
    return 'keuangan_' + bulan + '_' + tahun;
}

function saveData(bulan, tahun, data) {
    var key = getStorageKey(bulan, tahun);
    localStorage.setItem(key, JSON.stringify(data));
    console.log('💾 Data disimpan:', key, data);
}

function loadData(bulan, tahun) {
    var key = getStorageKey(bulan, tahun);
    var rawData = localStorage.getItem(key);
    if (!rawData) return null;
    try {
        return JSON.parse(rawData);
    } catch (e) {
        console.error('❌ Error parsing data:', e);
        return null;
    }
}

function deleteData(bulan, tahun) {
    var key = getStorageKey(bulan, tahun);
    localStorage.removeItem(key);
    console.log('🗑️ Data dihapus:', key);
}

// ============================================================
// 3. DOM FUNCTIONS (Render UI)
// ============================================================

function renderMenuUtama() {
    document.getElementById('menuUtama').classList.remove('hidden');
    document.getElementById('formKerja').classList.add('hidden');
}

function renderFormKerja(mode) {
    document.getElementById('menuUtama').classList.add('hidden');
    document.getElementById('formKerja').classList.remove('hidden');
    
    var title = document.getElementById('formTitle');
    if (mode === 'mode1') {
        title.textContent = '📋 Mode: Pelacak Pengeluaran Mandiri';
        document.getElementById('mode2Container').classList.add('hidden');
    } else {
        title.textContent = '💰 Mode: Manajer Anggaran & Saldo';
        document.getElementById('mode2Container').classList.remove('hidden');
    }
    
    document.getElementById('inputTanggal').value = getToday();
    document.getElementById('inputNominal').value = '';
    document.getElementById('inputDeskripsi').value = '';
    document.getElementById('inputAnggaranAwal').value = '';
    document.getElementById('statusSaldoContainer').classList.add('hidden');
    document.getElementById('biayaTetapContainer').innerHTML = '';
    
    document.getElementById('formKerja').dataset.mode = mode;
    
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    loadDataAndRender(bulan, tahun);
}

function renderBiayaTetap(biayaTetap) {
    var container = document.getElementById('biayaTetapContainer');
    container.innerHTML = '';
    
    if (!biayaTetap || biayaTetap.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Belum ada biaya tetap. Klik "Tambah Baris" untuk menambahkan.</p></div>';
        return;
    }
    
    biayaTetap.forEach(function(item, index) {
        var row = document.createElement('div');
        row.className = 'dynamic-row';
        row.innerHTML = `
            <input type="text" class="row-input biaya-komponen" value="${item.komponen || ''}" placeholder="Nama komponen">
            <input type="text" class="row-input row-input-nominal biaya-nominal" value="${item.nominal ? formatRupiah(item.nominal) : ''}" placeholder="Rp 0">
            <button class="btn-remove-row" data-index="${index}">✕</button>
        `;
        container.appendChild(row);
    });
    
    container.querySelectorAll('.btn-remove-row').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var index = parseInt(this.dataset.index);
            hapusBiayaTetap(index);
        });
    });
}

function renderTabel(pengeluaran) {
    var tbody = document.getElementById('tabelBody');
    var footer = document.getElementById('tabelFooter');
    var totalEl = document.getElementById('tabelTotal');
    
    if (!pengeluaran || pengeluaran.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Belum ada data pengeluaran</td></tr>';
        footer.classList.add('hidden');
        return;
    }
    
    var sorted = pengeluaran.slice().sort(function(a, b) {
        return b.tanggal.localeCompare(a.tanggal);
    });
    
    var html = '';
    var total = 0;
    
    sorted.forEach(function(item) {
        var nominal = item.nominal || 0;
        total += nominal;
        html += `
            <tr>
                <td>${formatTanggal(item.tanggal)}</td>
                <td>${item.kategori || '-'}</td>
                <td>${item.deskripsi || '-'}</td>
                <td>${formatRupiah(nominal)}</td>
                <td><button class="btn-hapus" data-id="${item.id}">🗑</button></td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    footer.classList.remove('hidden');
    totalEl.textContent = formatRupiah(total);
    
    tbody.querySelectorAll('.btn-hapus').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            hapusPengeluaran(id);
        });
    });
}

function renderRingkasan(data, bulan, tahun) {
    var textEl = document.getElementById('ringkasanText');
    var totalEl = document.getElementById('ringkasanTotal');
    
    if (!data) {
        textEl.textContent = 'Belum ada data untuk bulan ' + bulan + ' ' + tahun;
        totalEl.textContent = 'Rp 0';
        return;
    }
    
    var pengeluaran = data.pengeluaranHarian || [];
    var totalPengeluaran = 0;
    pengeluaran.forEach(function(item) {
        totalPengeluaran += (item.nominal || 0);
    });
    
    var biayaTetap = data.biayaTetap || [];
    biayaTetap.forEach(function(item) {
        totalPengeluaran += (item.nominal || 0);
    });
    
    var firstDate = data.firstDate || null;
    var today = getToday();
    var jumlahHari = 0;
    if (firstDate) {
        jumlahHari = hitungHari(firstDate, today);
    }
    
    var kalimat = '';
    if (jumlahHari < 30 && jumlahHari > 0) {
        kalimat = 'Total pengeluaran bulan ' + bulan + ' ' + tahun + ' selama ' + jumlahHari + ' hari adalah ' + formatRupiah(totalPengeluaran);
    } else if (jumlahHari >= 30) {
        kalimat = 'Total pengeluaran bulan ' + bulan + ' ' + tahun + ' adalah ' + formatRupiah(totalPengeluaran);
    } else {
        kalimat = 'Total pengeluaran bulan ' + bulan + ' ' + tahun + ' adalah ' + formatRupiah(totalPengeluaran);
    }
    
    textEl.textContent = kalimat;
    totalEl.textContent = formatRupiah(totalPengeluaran);
}

function renderStatusSaldo(data, anggaranAwal) {
    var container = document.getElementById('statusSaldoContainer');
    var alertEl = document.getElementById('statusSaldoAlert');
    var textEl = document.getElementById('statusSaldoText');
    var detailEl = document.getElementById('statusSaldoDetail');
    
    if (!data || !anggaranAwal || anggaranAwal <= 0) {
        container.classList.add('hidden');
        return;
    }
    
    var pengeluaran = data.pengeluaranHarian || [];
    var totalPengeluaran = 0;
    pengeluaran.forEach(function(item) {
        totalPengeluaran += (item.nominal || 0);
    });
    
    var biayaTetap = data.biayaTetap || [];
    biayaTetap.forEach(function(item) {
        totalPengeluaran += (item.nominal || 0);
    });
    
    var sisaSaldo = anggaranAwal - totalPengeluaran;
    
    container.classList.remove('hidden');
    
    if (sisaSaldo >= 0) {
        alertEl.className = 'alert alert-success';
        textEl.textContent = '✅ STATUS: UANG CUKUP & HEMAT';
        detailEl.textContent = 'Sisa Saldo: ' + formatRupiah(sisaSaldo);
    } else {
        alertEl.className = 'alert alert-danger';
        textEl.textContent = '❌ STATUS: UANG KURANG / DEFISIT';
        detailEl.textContent = 'Sisa Saldo: ' + formatRupiah(sisaSaldo) + ' (Defisit ' + formatRupiah(Math.abs(sisaSaldo)) + ')';
    }
}

function renderAll(bulan, tahun, data) {
    if (!data) {
        renderBiayaTetap([]);
        renderTabel([]);
        renderRingkasan(null, bulan, tahun);
        document.getElementById('statusSaldoContainer').classList.add('hidden');
        return;
    }
    
    renderBiayaTetap(data.biayaTetap || []);
    renderTabel(data.pengeluaranHarian || []);
    renderRingkasan(data, bulan, tahun);
    
    var mode = document.getElementById('formKerja').dataset.mode;
    if (mode === 'mode2') {
        var anggaranAwal = data.anggaranAwal || 0;
        document.getElementById('inputAnggaranAwal').value = anggaranAwal > 0 ? formatRupiah(anggaranAwal) : '';
        renderStatusSaldo(data, anggaranAwal);
    }
}

// ============================================================
// 4. LOGIC FUNCTIONS
// ============================================================

function loadDataAndRender(bulan, tahun) {
    var data = loadData(bulan, tahun);
    renderAll(bulan, tahun, data);
}

function saveCurrentData() {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    
    var data = loadData(bulan, tahun) || {};
    if (!data.biayaTetap) data.biayaTetap = [];
    if (!data.pengeluaranHarian) data.pengeluaranHarian = [];
    if (!data.firstDate) data.firstDate = null;
    if (!data.anggaranAwal) data.anggaranAwal = 0;
    
    saveData(bulan, tahun, data);
    return data;
}

function tambahBiayaTetap() {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    
    var data = loadData(bulan, tahun) || {};
    if (!data.biayaTetap) data.biayaTetap = [];
    
    data.biayaTetap.push({ komponen: '', nominal: 0 });
    
    saveData(bulan, tahun, data);
    renderBiayaTetap(data.biayaTetap);
    renderRingkasan(data, bulan, tahun);
    
    var mode = document.getElementById('formKerja').dataset.mode;
    if (mode === 'mode2') {
        renderStatusSaldo(data, data.anggaranAwal || 0);
    }
    
    showToast('Biaya tetap baru ditambahkan', 'success');
}

function hapusBiayaTetap(index) {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    
    var data = loadData(bulan, tahun) || {};
    if (!data.biayaTetap) data.biayaTetap = [];
    
    if (index >= 0 && index < data.biayaTetap.length) {
        data.biayaTetap.splice(index, 1);
        saveData(bulan, tahun, data);
        renderBiayaTetap(data.biayaTetap);
        renderRingkasan(data, bulan, tahun);
        
        var mode = document.getElementById('formKerja').dataset.mode;
        if (mode === 'mode2') {
            renderStatusSaldo(data, data.anggaranAwal || 0);
        }
        
        showToast('Biaya tetap dihapus', 'warning');
    }
}

function saveBiayaTetap() {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    
    var data = loadData(bulan, tahun) || {};
    if (!data.biayaTetap) data.biayaTetap = [];
    
    var rows = document.querySelectorAll('.dynamic-row');
    var newBiayaTetap = [];
    
    rows.forEach(function(row) {
        var komponen = row.querySelector('.biaya-komponen').value.trim();
        var nominalStr = row.querySelector('.biaya-nominal').value.trim();
        var nominal = parseRupiah(nominalStr);
        
        if (komponen || nominal > 0) {
            newBiayaTetap.push({
                komponen: komponen || 'Biaya',
                nominal: nominal
            });
        }
    });
    
    data.biayaTetap = newBiayaTetap;
    saveData(bulan, tahun, data);
    renderBiayaTetap(data.biayaTetap);
    renderRingkasan(data, bulan, tahun);
    
    var mode = document.getElementById('formKerja').dataset.mode;
    if (mode === 'mode2') {
        renderStatusSaldo(data, data.anggaranAwal || 0);
    }
    
    showToast('Biaya tetap disimpan', 'success');
}

function tambahPengeluaran() {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    
    var tanggal = document.getElementById('inputTanggal').value;
    var kategori = document.getElementById('inputKategori').value;
    var deskripsi = document.getElementById('inputDeskripsi').value.trim();
    var nominalStr = document.getElementById('inputNominal').value.trim();
    var nominal = parseRupiah(nominalStr);
    
    if (!tanggal) {
        showToast('Tanggal harus diisi', 'danger');
        return;
    }
    if (nominal <= 0) {
        showToast('Nominal harus lebih dari 0', 'danger');
        return;
    }
    
    var data = loadData(bulan, tahun) || {};
    if (!data.pengeluaranHarian) data.pengeluaranHarian = [];
    if (!data.firstDate) data.firstDate = tanggal;
    
    data.pengeluaranHarian.push({
        id: generateId(),
        tanggal: tanggal,
        kategori: kategori,
        deskripsi: deskripsi || '-',
        nominal: nominal
    });
    
    saveData(bulan, tahun, data);
    renderTabel(data.pengeluaranHarian);
    renderRingkasan(data, bulan, tahun);
    
    var mode = document.getElementById('formKerja').dataset.mode;
    if (mode === 'mode2') {
        renderStatusSaldo(data, data.anggaranAwal || 0);
    }
    
    document.getElementById('inputNominal').value = '';
    document.getElementById('inputDeskripsi').value = '';
    document.getElementById('inputTanggal').value = getToday();
    
    showToast('Pengeluaran berhasil ditambahkan! 💰', 'success');
}

function hapusPengeluaran(id) {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    
    var data = loadData(bulan, tahun) || {};
    if (!data.pengeluaranHarian) data.pengeluaranHarian = [];
    
    data.pengeluaranHarian = data.pengeluaranHarian.filter(function(item) {
        return item.id !== id;
    });
    
    if (data.pengeluaranHarian.length > 0) {
        var dates = data.pengeluaranHarian.map(function(item) { return item.tanggal; });
        dates.sort();
        data.firstDate = dates[0];
    } else {
        data.firstDate = null;
    }
    
    saveData(bulan, tahun, data);
    renderTabel(data.pengeluaranHarian);
    renderRingkasan(data, bulan, tahun);
    
    var mode = document.getElementById('formKerja').dataset.mode;
    if (mode === 'mode2') {
        renderStatusSaldo(data, data.anggaranAwal || 0);
    }
    
    showToast('Data pengeluaran dihapus', 'warning');
}

function saveAnggaranAwal() {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    
    var nominalStr = document.getElementById('inputAnggaranAwal').value.trim();
    var nominal = parseRupiah(nominalStr);
    
    if (nominal <= 0) {
        showToast('Anggaran harus lebih dari 0', 'danger');
        return;
    }
    
    var data = loadData(bulan, tahun) || {};
    data.anggaranAwal = nominal;
    
    saveData(bulan, tahun, data);
    renderStatusSaldo(data, nominal);
    showToast('Anggaran awal disimpan! 💰', 'success');
}

// ============================================================
// 5. EVENT LISTENERS
// ============================================================

// ===== Menu Utama =====
document.getElementById('btnMode1').addEventListener('click', function() {
    renderFormKerja('mode1');
});

document.getElementById('btnMode2').addEventListener('click', function() {
    renderFormKerja('mode2');
});

// ===== Kembali ke Menu =====
document.getElementById('btnKembaliMenu').addEventListener('click', function() {
    saveBiayaTetap();
    renderMenuUtama();
});

// ===== Muat Data =====
document.getElementById('btnLoadData').addEventListener('click', function() {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    loadDataAndRender(bulan, tahun);
    showToast('Data berhasil dimuat! 📊', 'info');
});

// ===== Tambah Biaya Tetap =====
document.getElementById('btnTambahBiayaTetap').addEventListener('click', function() {
    tambahBiayaTetap();
});

// ===== Tambah Pengeluaran =====
document.getElementById('btnTambahPengeluaran').addEventListener('click', function() {
    tambahPengeluaran();
});

// ===== Simpan Anggaran Awal =====
document.getElementById('inputAnggaranAwal').addEventListener('change', function() {
    saveAnggaranAwal();
});

// ===== Enter key untuk menambah pengeluaran =====
document.getElementById('inputNominal').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        tambahPengeluaran();
    }
});

document.getElementById('inputDeskripsi').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        tambahPengeluaran();
    }
});

// ===== Format Rupiah otomatis =====
document.addEventListener('blur', function(e) {
    if (e.target.classList.contains('biaya-nominal') || 
        e.target.id === 'inputNominal' || 
        e.target.id === 'inputAnggaranAwal') {
        var value = parseRupiah(e.target.value);
        if (value > 0) {
            e.target.value = formatRupiah(value);
        }
    }
}, true);

// ============================================================
// 6. INITIALIZATION
// ============================================================

function init() {
    document.getElementById('inputTanggal').value = getToday();
    
    var now = new Date();
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    document.getElementById('selectBulan').value = months[now.getMonth()];
    document.getElementById('inputTahun').value = now.getFullYear();
    
    renderMenuUtama();
    
    console.log('🚀 MahaMate - Program Keuangan siap digunakan!');
    console.log('📌 Data tersimpan di LocalStorage browser Anda.');
}

document.addEventListener('DOMContentLoaded', init);