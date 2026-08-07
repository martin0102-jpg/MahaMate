// ============================================================
// PROGRAM KEUANGAN - MAHAMATE
// ============================================================

console.log('🔧 Inisialisasi Program Keuangan...');

// ============================================================
// 1. KONFIGURASI API
// ============================================================

const API_URL = 'http://localhost:3000/api/keuangan';

// ============================================================
// 2. SIDEBAR & NAVBAR FUNCTIONS
// ============================================================

// ===== 2a. SIDEBAR TOGGLE =====
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

// ===== 2b. DROPDOWN TOGGLE =====
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

// ===== 2c. THEME TOGGLE =====
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

// ===== 2d. LOGIN STATE =====
function isLoggedIn() {
    return localStorage.getItem('mahamate_session') !== null;
}

function getCurrentUser() {
    var session = localStorage.getItem('mahamate_session');
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

// ===== 2e. LOGOUT POPUP =====
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

// ===== 2f. LOGIN ICON CLICK =====
var btnLoginIcon = document.getElementById('btnLoginIcon');
if (btnLoginIcon) {
    btnLoginIcon.addEventListener('click', function() {
        if (isLoggedIn()) {
            showToast('👤 Halaman Profile sedang dalam pengembangan', 'info');
        } else {
            window.location.href = '../../dashboard/dashboard.html';
        }
    });
}

// ===== 2g. LOGOUT FROM SIDEBAR =====
var btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', function(e) {
        e.preventDefault();
        openLogoutPopup();
    });
}

// ===== 2h. PROFILE LINK =====
var profileLink = document.getElementById('profileLink');
if (profileLink) {
    profileLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (isLoggedIn()) {
            showToast('👤 Halaman Profile sedang dalam pengembangan', 'info');
        } else {
            window.location.href = '../../dashboard/dashboard.html';
        }
    });
}

// ===== 2i. UPDATE UI SAAT LOAD =====
updateUIForLogin();

// ===== 2j. AKTIFKAN MENU =====
document.querySelectorAll('.dropdown-link.active').forEach(function(link) {
    var parent = link.closest('.sidebar-item');
    if (parent) {
        parent.classList.add('open');
    }
});

console.log('✅ Sidebar & Navbar siap!');

// ============================================================
// 3. UTILITY FUNCTIONS
// ============================================================

function formatRupiah(angka) {
    if (!angka || isNaN(angka)) return 'Rp 0';
    return 'Rp ' + angka.toLocaleString('id-ID');
}

function parseRupiah(str) {
    if (!str) return 0;
    var cleaned = str.replace(/Rp\s?/g, '').replace(/\./g, '');
    var num = parseInt(cleaned);
    return isNaN(num) ? 0 : num;
}

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    var datePart = dateStr.split('T')[0];
    var parts = datePart.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function getToday() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function hitungHari(startDate, endDate) {
    if (!startDate) return 0;
    var start = new Date(startDate);
    var end = new Date(endDate);
    var diffTime = Math.abs(end - start);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
}

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
// 4. DATA FUNCTIONS
// ============================================================

// ===== 4a. LOCAL STORAGE KEY (dengan mode) =====
function getStorageKey(bulan, tahun, mode) {
    return 'keuangan_' + mode + '_' + bulan + '_' + tahun;
}

// ===== LOAD DATA DARI API (dengan filter mode) =====
async function loadDataFromApi(bulan, tahun, mode) {
    try {
        // Kirim mode sebagai query parameter
        const url = `${API_URL}/${bulan}/${tahun}?mode=${mode}`;
        console.log('📥 Memuat data dari:', url);
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Data diterima:', result.data);
            return {
                pengeluaranHarian: result.data.map(function(item) {
                    return {
                        id: item.id,
                        tanggal: item.tanggal,
                        kategori: item.kategori,
                        deskripsi: item.deskripsi,
                        nominal: parseFloat(item.nominal),
                        mode: item.mode || mode
                    };
                }),
                totalPengeluaran: result.total || 0
            };
        }
        return null;
    } catch (error) {
        console.error('❌ Error load data from API:', error);
        showToast('Gagal memuat data dari server', 'danger');
        return null;
    }
}

// ===== 4c. LOAD DATA DARI LOCALSTORAGE (dengan mode) =====
function loadLocalData(bulan, tahun, mode) {
    var key = getStorageKey(bulan, tahun, mode);
    var rawData = localStorage.getItem(key);
    if (!rawData) return null;
    try {
        return JSON.parse(rawData);
    } catch (e) {
        console.error('❌ Error parsing local data:', e);
        return null;
    }
}

// ===== 4d. SAVE DATA KE LOCALSTORAGE (dengan mode) =====
function saveLocalData(bulan, tahun, mode, data) {
    var key = getStorageKey(bulan, tahun, mode);
    localStorage.setItem(key, JSON.stringify({
        biayaTetap: data.biayaTetap || [],
        anggaranAwal: data.anggaranAwal || 0
    }));
    console.log('💾 Data biaya tetap & anggaran disimpan untuk mode:', mode);
}

// ===== 4e. TAMBAH PENGELUARAN KE API (dengan mode) =====
async function tambahPengeluaranKeAPI(data) {
    try {
        console.log('📤 Mengirim data ke API:', data);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('❌ Error tambah pengeluaran:', error);
        return { success: false, message: 'Gagal terhubung ke server' };
    }
}

// ===== 4f. HAPUS PENGELUARAN DARI API =====
async function hapusPengeluaranDariAPI(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('❌ Error hapus pengeluaran:', error);
        return { success: false, message: 'Gagal terhubung ke server' };
    }
}

// ============================================================
// 5. DOM FUNCTIONS (Render UI)
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
    
    // Reset form
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
    
    if (!biayaTetap || !Array.isArray(biayaTetap) || biayaTetap.length === 0) {
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
    var inputAnggaran = document.getElementById('inputAnggaranAwal');
    var statusSaldo = document.getElementById('statusSaldoContainer');
    
    if (formKerja && formKerja.dataset.mode === 'mode2') {
        var anggaranAwal = data.anggaranAwal || 0;
        if (inputAnggaran) {
            inputAnggaran.value = anggaranAwal > 0 ? formatRupiah(anggaranAwal) : '';
        }
        renderStatusSaldo(data, anggaranAwal);
    } else {
        if (inputAnggaran) inputAnggaran.value = '';
        if (statusSaldo) statusSaldo.classList.add('hidden');
    }
}

// ============================================================
// 6. LOGIC FUNCTIONS
// ============================================================

// ===== 6a. LOAD DATA & RENDER =====
async function loadDataAndRender(bulan, tahun) {
    try {
        var formKerja = document.getElementById('formKerja');
        var currentMode = formKerja ? formKerja.dataset.mode : 'mode1';
        
        console.log('📥 Memuat data untuk mode:', currentMode);
        
        // Load dari API dengan mode
        var apiData = await loadDataFromApi(bulan, tahun, currentMode);
        
        // Load dari LocalStorage dengan mode
        var localData = loadLocalData(bulan, tahun, currentMode) || {};
        
        var mergedData = {
            pengeluaranHarian: apiData?.pengeluaranHarian || [],
            totalPengeluaran: apiData?.totalPengeluaran || 0,
            biayaTetap: localData.biayaTetap || [],
            anggaranAwal: currentMode === 'mode2' ? (localData.anggaranAwal || 0) : 0,
            firstDate: apiData?.pengeluaranHarian?.length > 0 ? apiData.pengeluaranHarian[0].tanggal : null,
            mode: currentMode
        };
        
        renderAll(bulan, tahun, mergedData);
        console.log('✅ Data dimuat untuk mode:', currentMode);
    } catch (error) {
        console.error('❌ Error loadDataAndRender:', error);
        showToast('Gagal memuat data', 'danger');
    }
}

// ===== 6b. TAMBAH BIAYA TETAP =====
function tambahBiayaTetap() {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    var formKerja = document.getElementById('formKerja');
    var currentMode = formKerja ? formKerja.dataset.mode : 'mode1';
    
    // Ambil data dari DOM
    var existingRows = document.querySelectorAll('.dynamic-row');
    var existingData = [];
    
    existingRows.forEach(function(row) {
        var komponen = row.querySelector('.biaya-komponen').value.trim();
        var nominalStr = row.querySelector('.biaya-nominal').value.trim();
        var nominal = parseRupiah(nominalStr);
        existingData.push({
            komponen: komponen,
            nominal: nominal
        });
    });
    
    var localData = loadLocalData(bulan, tahun, currentMode) || {};
    if (!localData.biayaTetap) localData.biayaTetap = [];
    
    if (existingData.length > 0) {
        localData.biayaTetap = existingData;
    }
    
    localData.biayaTetap.push({ komponen: '', nominal: 0 });
    saveLocalData(bulan, tahun, currentMode, localData);
    
    renderBiayaTetap(localData.biayaTetap);
    showToast('Baris biaya tetap ditambahkan', 'info');
}

// ===== 6c. HAPUS BIAYA TETAP =====
function hapusBiayaTetap(index) {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    var formKerja = document.getElementById('formKerja');
    var currentMode = formKerja ? formKerja.dataset.mode : 'mode1';
    
    var rows = document.querySelectorAll('.dynamic-row');
    var currentData = [];
    
    rows.forEach(function(row) {
        var komponen = row.querySelector('.biaya-komponen').value.trim();
        var nominalStr = row.querySelector('.biaya-nominal').value.trim();
        var nominal = parseRupiah(nominalStr);
        currentData.push({
            komponen: komponen || '',
            nominal: nominal || 0
        });
    });
    
    if (index >= 0 && index < currentData.length) {
        currentData.splice(index, 1);
    }
    
    var data = loadLocalData(bulan, tahun, currentMode) || {};
    data.biayaTetap = currentData;
    saveLocalData(bulan, tahun, currentMode, data);
    renderBiayaTetap(currentData);
    showToast('Biaya tetap dihapus', 'warning');
}

// ===== 6d. SAVE BIAYA TETAP =====
function saveBiayaTetap() {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    var formKerja = document.getElementById('formKerja');
    var currentMode = formKerja ? formKerja.dataset.mode : 'mode1';
    
    var rows = document.querySelectorAll('.dynamic-row');
    var newBiayaTetap = [];
    
    rows.forEach(function(row) {
        var komponen = row.querySelector('.biaya-komponen').value.trim();
        var nominalStr = row.querySelector('.biaya-nominal').value.trim();
        var nominal = parseRupiah(nominalStr);
        newBiayaTetap.push({
            komponen: komponen || '',
            nominal: nominal || 0
        });
    });
    
    var data = loadLocalData(bulan, tahun, currentMode) || {};
    data.biayaTetap = newBiayaTetap;
    saveLocalData(bulan, tahun, currentMode, data);
    renderBiayaTetap(newBiayaTetap);
    showToast('Biaya tetap disimpan', 'success');
}

// ===== 6e. TAMBAH PENGELUARAN =====
async function tambahPengeluaran() {
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
    
    // AMBIL MODE SAAT INI
    var formKerja = document.getElementById('formKerja');
    var currentMode = formKerja ? formKerja.dataset.mode : 'mode1';
    
    console.log('🔍 Menambah pengeluaran dengan mode:', currentMode);
    
    var result = await tambahPengeluaranKeAPI({
        bulan: bulan,
        tahun: tahun,
        tanggal: tanggal,
        kategori: kategori,
        deskripsi: deskripsi || '-',
        nominal: nominal,
        mode: currentMode
    });
    
    if (result.success) {
        document.getElementById('inputNominal').value = '';
        document.getElementById('inputDeskripsi').value = '';
        document.getElementById('inputTanggal').value = getToday();
        
        await loadDataAndRender(bulan, tahun);
        showToast('Pengeluaran berhasil ditambahkan! 💰', 'success');
    } else {
        showToast(result.message || 'Gagal menambahkan data', 'danger');
    }
}

// ===== 6f. HAPUS PENGELUARAN =====
async function hapusPengeluaran(id) {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    
    var result = await hapusPengeluaranDariAPI(id);
    
    if (result.success) {
        await loadDataAndRender(bulan, tahun);
        showToast('Data pengeluaran dihapus', 'warning');
    } else {
        showToast(result.message || 'Gagal menghapus data', 'danger');
    }
}

// ===== 6g. SAVE ANGGARAN AWAL =====
function saveAnggaranAwal() {
    var bulan = document.getElementById('selectBulan').value;
    var tahun = parseInt(document.getElementById('inputTahun').value);
    var formKerja = document.getElementById('formKerja');
    var currentMode = formKerja ? formKerja.dataset.mode : 'mode1';
    
    if (currentMode !== 'mode2') {
        showToast('Fitur anggaran hanya tersedia di Mode 2', 'warning');
        return;
    }
    
    var nominalStr = document.getElementById('inputAnggaranAwal').value.trim();
    var nominal = parseRupiah(nominalStr);
    
    if (nominal <= 0) {
        showToast('Anggaran harus lebih dari 0', 'danger');
        return;
    }
    
    var data = loadLocalData(bulan, tahun, currentMode) || {};
    data.anggaranAwal = nominal;
    saveLocalData(bulan, tahun, currentMode, data);
    
    loadDataAndRender(bulan, tahun);
    showToast('Anggaran awal disimpan! 💰', 'success');
}

// ============================================================
// 7. EVENT LISTENERS
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
// 8. INITIALIZATION
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
    console.log('📡 API:', API_URL);
}

document.addEventListener('DOMContentLoaded', init);

console.log('✅ Semua fungsi siap digunakan!');