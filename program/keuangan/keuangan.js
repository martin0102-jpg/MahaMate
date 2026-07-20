// ============================================================
// PROGRAM KEUANGAN - MAHAMATE
// ============================================================

// ============================================================
// 1. SIDEBAR & NAVBAR FUNCTIONS
// ============================================================

console.log('🔧 Inisialisasi Sidebar...');

// ===== 1a. SIDEBAR TOGGLE =====
var sidebar = document.getElementById('sidebar');
var sidebarOverlay = document.getElementById('sidebarOverlay');
var menuToggle = document.getElementById('menuToggle');
var sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
    if (sidebar) {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('✅ Sidebar dibuka');
    }
}

function closeSidebar() {
    if (sidebar) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
        console.log('✅ Sidebar ditutup');
    }
}

if (menuToggle) {
    menuToggle.addEventListener('click', openSidebar);
} else {
    console.log('❌ menuToggle tidak ditemukan!');
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// ===== 1b. DROPDOWN TOGGLE (Sidebar) =====
var dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var parent = this.closest('.sidebar-item');
        if (!parent) return;
        
        var isOpen = parent.classList.contains('open');

        document.querySelectorAll('.sidebar-item.open').forEach(function(item) {
            if (item !== parent) {
                item.classList.remove('open');
            }
        });

        if (isOpen) {
            parent.classList.remove('open');
        } else {
            parent.classList.add('open');
        }
    });
});

// ===== 1c. THEME TOGGLE =====
var themeToggle = document.getElementById('themeToggle');
var themeIcon = document.getElementById('themeIcon');
var isDark = localStorage.getItem('theme') === 'dark';

if (isDark) {
    document.body.classList.add('dark-mode');
    if (themeIcon) themeIcon.textContent = 'light_mode';
}

if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        isDark = !isDark;
        
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeIcon.textContent = 'light_mode';
            localStorage.setItem('theme', 'dark');
            showToast('🌙 Mode Dark diaktifkan', 'info');
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.textContent = 'dark_mode';
            localStorage.setItem('theme', 'light');
            showToast('☀️ Mode Light diaktifkan', 'info');
        }
    });
}

// ===== 1d. LOGIN STATE =====
function isLoggedIn() {
    return localStorage.getItem('mahamate_session') !== null;
}

function getCurrentUser() {
    var session = localStorage.getItem('mahamate_session'); // ← PAKAI TANDA PETIK!
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch (e) {
        return null;
    }
}

function updateUIForLogin() {
    var session = getCurrentUser();
    var loginIcon = document.getElementById('loginIcon');
    var btnLogin = document.getElementById('btnLoginIcon');
    var profileText = document.getElementById('profileText');
    
    if (session) {
        if (btnLogin) {
            btnLogin.classList.add('logged-in');
            btnLogin.title = session.name + ' (Klik untuk logout)';
        }
        if (loginIcon) loginIcon.textContent = 'account_circle';
        if (profileText) profileText.textContent = session.name;
    } else {
        if (btnLogin) {
            btnLogin.classList.remove('logged-in');
            btnLogin.title = 'Login';
        }
        if (loginIcon) loginIcon.textContent = 'account_circle';
        if (profileText) profileText.textContent = 'Profile';
    }
}

// ===== 1e. LOGOUT POPUP =====
var logoutOverlay = document.getElementById('logoutOverlay');
var logoutCancel = document.getElementById('logoutCancel');
var logoutConfirm = document.getElementById('logoutConfirm');

function openLogoutPopup() {
    if (logoutOverlay) {
        logoutOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLogoutPopup() {
    if (logoutOverlay) {
        logoutOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (logoutCancel) {
    logoutCancel.addEventListener('click', closeLogoutPopup);
}

if (logoutConfirm) {
    logoutConfirm.addEventListener('click', function() {
        localStorage.removeItem('mahamate_session');
        updateUIForLogin();
        closeLogoutPopup();
        showToast('Anda telah logout', 'warning');
    });
}

if (logoutOverlay) {
    logoutOverlay.addEventListener('click', function(e) {
        if (e.target === logoutOverlay) {
            closeLogoutPopup();
        }
    });
}

// ===== 1f. LOGIN ICON CLICK (Navbar) =====
var btnLoginIcon = document.getElementById('btnLoginIcon');
if (btnLoginIcon) {
    btnLoginIcon.addEventListener('click', function() {
        if (isLoggedIn()) {
            showToast('👤 Halaman Profile sedang dalam pengembangan', 'info');
        } else {
            window.location.href = '../../dashboard.html';
        }
    });
}

// ===== 1g. LOGOUT FROM SIDEBAR =====
var btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', function(e) {
        e.preventDefault();
        openLogoutPopup();
    });
}

// ===== 1h. PROFILE LINK =====
var profileLink = document.getElementById('profileLink');
if (profileLink) {
    profileLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (isLoggedIn()) {
            showToast('👤 Halaman Profile sedang dalam pengembangan', 'info');
        } else {
            window.location.href = '../../dashboard.html';
        }
    });
}

// ===== 1i. UPDATE UI SAAT LOAD =====
updateUIForLogin();

// ===== 1j. AKTIFKAN MENU YANG SEDANG DIBUKA =====
document.querySelectorAll('.dropdown-link.active').forEach(function(link) {
    var parent = link.closest('.sidebar-item');
    if (parent) {
        parent.classList.add('open');
    }
});

console.log('✅ Sidebar & Navbar siap!');

// ============================================================
// 2. UTILITY FUNCTIONS
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
    if (!toast) {
        var container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = 'position:fixed;bottom:30px;right:30px;z-index:9999;';
            document.body.appendChild(container);
        }
        toast = document.createElement('div');
        toast.id = 'toastMessage';
        toast.style.cssText = 'background:#151A2D;color:#fff;padding:14px 24px;border-radius:12px;font-weight:500;font-size:0.95rem;box-shadow:0 8px 30px rgba(0,0,0,0.2);border-left:4px solid #00C2FF;max-width:400px;display:none;opacity:0;transition:opacity 0.3s ease;';
        container.appendChild(toast);
    }
    
    var colors = {
        success: '#1B4D3E',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0d6efd'
    };
    toast.textContent = message;
    toast.style.borderLeftColor = colors[type] || colors.info;
    toast.className = 'show';
    toast.style.display = 'block';
    toast.style.opacity = '1';
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.style.opacity = '0';
        setTimeout(function() {
            toast.style.display = 'none';
        }, 300);
    }, 2500);
}

// ============================================================
// 3. DATA FUNCTIONS (LocalStorage)
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
// 4. DOM FUNCTIONS (Render UI)
// ============================================================

function renderMenuUtama() {
    var menu = document.getElementById('menuUtama');
    var form = document.getElementById('formKerja');
    if (menu) menu.classList.remove('hidden');
    if (form) form.classList.add('hidden');
}

function renderFormKerja(mode) {
    var menu = document.getElementById('menuUtama');
    var form = document.getElementById('formKerja');
    if (menu) menu.classList.add('hidden');
    if (form) form.classList.remove('hidden');
    
    var title = document.getElementById('formTitle');
    if (title) {
        if (mode === 'mode1') {
            title.textContent = '📋 Mode: Pelacak Pengeluaran Mandiri';
            var mode2 = document.getElementById('mode2Container');
            if (mode2) mode2.classList.add('hidden');
        } else {
            title.textContent = '💰 Mode: Manajer Anggaran & Saldo';
            var mode2 = document.getElementById('mode2Container');
            if (mode2) mode2.classList.remove('hidden');
        }
    }
    
    var tanggal = document.getElementById('inputTanggal');
    if (tanggal) tanggal.value = getToday();
    
    var nominal = document.getElementById('inputNominal');
    if (nominal) nominal.value = '';
    
    var deskripsi = document.getElementById('inputDeskripsi');
    if (deskripsi) deskripsi.value = '';
    
    var anggaran = document.getElementById('inputAnggaranAwal');
    if (anggaran) anggaran.value = '';
    
    var statusSaldo = document.getElementById('statusSaldoContainer');
    if (statusSaldo) statusSaldo.classList.add('hidden');
    
    var biayaContainer = document.getElementById('biayaTetapContainer');
    if (biayaContainer) biayaContainer.innerHTML = '';
    
    var formKerja = document.getElementById('formKerja');
    if (formKerja) formKerja.dataset.mode = mode;
    
    var bulan = document.getElementById('selectBulan');
    var tahun = document.getElementById('inputTahun');
    if (bulan && tahun) {
        loadDataAndRender(bulan.value, parseInt(tahun.value));
    }
}

function renderBiayaTetap(biayaTetap) {
    var container = document.getElementById('biayaTetapContainer');
    if (!container) return;
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
    
    if (!tbody) return;
    
    if (!pengeluaran || pengeluaran.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Belum ada data pengeluaran</td></tr>';
        if (footer) footer.classList.add('hidden');
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
    if (footer) footer.classList.remove('hidden');
    if (totalEl) totalEl.textContent = formatRupiah(total);
    
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
    
    if (!textEl) return;
    
    if (!data) {
        textEl.textContent = 'Belum ada data untuk bulan ' + bulan + ' ' + tahun;
        if (totalEl) totalEl.textContent = 'Rp 0';
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
    } else {
        kalimat = 'Total pengeluaran bulan ' + bulan + ' ' + tahun + ' adalah ' + formatRupiah(totalPengeluaran);
    }
    
    textEl.textContent = kalimat;
    if (totalEl) totalEl.textContent = formatRupiah(totalPengeluaran);
}

function renderStatusSaldo(data, anggaranAwal) {
    var container = document.getElementById('statusSaldoContainer');
    var alertEl = document.getElementById('statusSaldoAlert');
    var textEl = document.getElementById('statusSaldoText');
    var detailEl = document.getElementById('statusSaldoDetail');
    
    if (!container) return;
    
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
        var statusSaldo = document.getElementById('statusSaldoContainer');
        if (statusSaldo) statusSaldo.classList.add('hidden');
        return;
    }
    
    renderBiayaTetap(data.biayaTetap || []);
    renderTabel(data.pengeluaranHarian || []);
    renderRingkasan(data, bulan, tahun);
    
    var formKerja = document.getElementById('formKerja');
    if (formKerja && formKerja.dataset.mode === 'mode2') {
        var anggaranAwal = data.anggaranAwal || 0;
        var inputAnggaran = document.getElementById('inputAnggaranAwal');
        if (inputAnggaran) inputAnggaran.value = anggaranAwal > 0 ? formatRupiah(anggaranAwal) : '';
        renderStatusSaldo(data, anggaranAwal);
    }
}

// ============================================================
// 5. LOGIC FUNCTIONS
// ============================================================

function loadDataAndRender(bulan, tahun) {
    var data = loadData(bulan, tahun);
    renderAll(bulan, tahun, data);
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
    
    var formKerja = document.getElementById('formKerja');
    if (formKerja && formKerja.dataset.mode === 'mode2') {
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
        
        var formKerja = document.getElementById('formKerja');
        if (formKerja && formKerja.dataset.mode === 'mode2') {
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
    
    var formKerja = document.getElementById('formKerja');
    if (formKerja && formKerja.dataset.mode === 'mode2') {
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
    
    var formKerja = document.getElementById('formKerja');
    if (formKerja && formKerja.dataset.mode === 'mode2') {
        renderStatusSaldo(data, data.anggaranAwal || 0);
    }
    
    var inputNominal = document.getElementById('inputNominal');
    var inputDeskripsi = document.getElementById('inputDeskripsi');
    var inputTanggal = document.getElementById('inputTanggal');
    if (inputNominal) inputNominal.value = '';
    if (inputDeskripsi) inputDeskripsi.value = '';
    if (inputTanggal) inputTanggal.value = getToday();
    
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
    
    var formKerja = document.getElementById('formKerja');
    if (formKerja && formKerja.dataset.mode === 'mode2') {
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
// 6. EVENT LISTENERS (Keuangan)
// ============================================================

// ===== Menu Utama =====
var btnMode1 = document.getElementById('btnMode1');
var btnMode2 = document.getElementById('btnMode2');

if (btnMode1) {
    btnMode1.addEventListener('click', function() {
        renderFormKerja('mode1');
    });
}

if (btnMode2) {
    btnMode2.addEventListener('click', function() {
        renderFormKerja('mode2');
    });
}

// ===== Kembali ke Menu =====
var btnKembali = document.getElementById('btnKembaliMenu');
if (btnKembali) {
    btnKembali.addEventListener('click', function() {
        saveBiayaTetap();
        renderMenuUtama();
    });
}

// ===== Muat Data =====
var btnLoadData = document.getElementById('btnLoadData');
if (btnLoadData) {
    btnLoadData.addEventListener('click', function() {
        var bulan = document.getElementById('selectBulan').value;
        var tahun = parseInt(document.getElementById('inputTahun').value);
        loadDataAndRender(bulan, tahun);
        showToast('Data berhasil dimuat! 📊', 'info');
    });
}

// ===== Tambah Biaya Tetap =====
var btnTambahBiaya = document.getElementById('btnTambahBiayaTetap');
if (btnTambahBiaya) {
    btnTambahBiaya.addEventListener('click', function() {
        tambahBiayaTetap();
    });
}

// ===== Tambah Pengeluaran =====
var btnTambahPengeluaran = document.getElementById('btnTambahPengeluaran');
if (btnTambahPengeluaran) {
    btnTambahPengeluaran.addEventListener('click', function() {
        tambahPengeluaran();
    });
}

// ===== Simpan Anggaran Awal =====
var inputAnggaran = document.getElementById('inputAnggaranAwal');
if (inputAnggaran) {
    inputAnggaran.addEventListener('change', function() {
        saveAnggaranAwal();
    });
}

// ===== Enter key =====
var inputNominal = document.getElementById('inputNominal');
if (inputNominal) {
    inputNominal.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            tambahPengeluaran();
        }
    });
}

var inputDeskripsi = document.getElementById('inputDeskripsi');
if (inputDeskripsi) {
    inputDeskripsi.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            tambahPengeluaran();
        }
    });
}

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
// 7. INITIALIZATION
// ============================================================

function init() {
    var tanggal = document.getElementById('inputTanggal');
    if (tanggal) tanggal.value = getToday();
    
    var now = new Date();
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var selectBulan = document.getElementById('selectBulan');
    var inputTahun = document.getElementById('inputTahun');
    
    if (selectBulan) selectBulan.value = months[now.getMonth()];
    if (inputTahun) inputTahun.value = now.getFullYear();
    
    renderMenuUtama();
    
    console.log('🚀 MahaMate - Program Keuangan siap digunakan!');
    console.log('📌 Data tersimpan di LocalStorage browser Anda.');
}

document.addEventListener('DOMContentLoaded', init);

console.log('✅ Semua fungsi siap digunakan!');