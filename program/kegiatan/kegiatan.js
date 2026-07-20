// ============================================================
// PROGRAM KEGIATAN - MAHAMATE
// ============================================================
// 1. UTILITY FUNCTIONS
// 2. DATA FUNCTIONS (LocalStorage)
// 3. DOM FUNCTIONS (Render UI)
// 4. LOGIC FUNCTIONS
// 5. EVENT LISTENERS
// 6. INITIALIZATION
// ============================================================



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



// ============================================================
// 1. UTILITY FUNCTIONS
// ============================================================

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    var parts = dateStr.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function getToday() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function isActivityActive(kegiatan) {
    if (!kegiatan.tanggalMulai) return false;
    if (kegiatan.status === 'Selesai' || kegiatan.status === 'Dibatalkan') return false;
    
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var mulai = new Date(kegiatan.tanggalMulai);
    mulai.setHours(0, 0, 0, 0);
    
    return mulai <= today;
}

function isUpcoming(kegiatan) {
    if (!kegiatan.tanggalMulai) return false;
    if (kegiatan.status === 'Selesai' || kegiatan.status === 'Dibatalkan') return false;
    
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var mulai = new Date(kegiatan.tanggalMulai);
    mulai.setHours(0, 0, 0, 0);
    
    return mulai > today;
}

function getDaysUntil(dateStr) {
    if (!dateStr) return 0;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    var diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function showToast(message) {
    var toast = document.getElementById('toastMessage');
    toast.textContent = message;
    toast.className = 'show';
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.className = '';
    }, 2500);
}

// ============================================================
// 2. DATA FUNCTIONS (LocalStorage)
// ============================================================

var STORAGE_KEY = 'kegiatan_data';

function loadData() {
    var data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { kegiatan: [] };
    try {
        return JSON.parse(data);
    } catch (e) {
        return { kegiatan: [] };
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
        title.textContent = '📅 Mode: Kegiatan Aktif';
    } else {
        title.textContent = '✅ Mode: Kegiatan Selesai';
    }
    
    document.getElementById('formKerja').dataset.mode = mode;
    
    // Reset form
    document.getElementById('inputNama').value = '';
    document.getElementById('inputLokasi').value = '';
    document.getElementById('inputDeskripsi').value = '';
    document.getElementById('inputMulai').value = getToday();
    document.getElementById('inputSelesai').value = getToday();
    
    renderAll();
}

function renderStats(data) {
    var total = data.kegiatan.length;
    var selesai = data.kegiatan.filter(function(k) { return k.status === 'Selesai'; }).length;
    var berlangsung = data.kegiatan.filter(function(k) { 
        return k.status === 'Berlangsung' || (isActivityActive(k) && k.status !== 'Selesai' && k.status !== 'Dibatalkan');
    }).length;
    var rencana = data.kegiatan.filter(function(k) { 
        return k.status === 'Rencana' || isUpcoming(k);
    }).length;
    
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statSelesai').textContent = selesai;
    document.getElementById('statBerlangsung').textContent = berlangsung;
    document.getElementById('statRencana').textContent = rencana;
}

function renderUpcoming(data) {
    var container = document.getElementById('upcomingList');
    var mode = document.getElementById('formKerja').dataset.mode;
    
    var kegiatanList = data.kegiatan || [];
    
    // Filter berdasarkan mode
    if (mode === 'mode1') {
        kegiatanList = kegiatanList.filter(function(k) { 
            return k.status !== 'Selesai' && k.status !== 'Dibatalkan';
        });
    } else if (mode === 'mode2') {
        kegiatanList = kegiatanList.filter(function(k) { 
            return k.status === 'Selesai';
        });
    }
    
    // Ambil kegiatan mendatang
    var upcoming = kegiatanList.filter(function(k) {
        return isUpcoming(k);
    });
    
    // Sort by tanggal mulai
    upcoming.sort(function(a, b) {
        return a.tanggalMulai.localeCompare(b.tanggalMulai);
    });
    
    // Ambil 5 terdekat
    upcoming = upcoming.slice(0, 5);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p class="text-muted">Tidak ada kegiatan mendatang</p>';
        return;
    }
    
    var html = '';
    upcoming.forEach(function(k) {
        var days = getDaysUntil(k.tanggalMulai);
        var badgeText = days <= 3 ? '⚠️ Segera!' : days + ' hari lagi';
        var badgeClass = days <= 3 ? 'upcoming-badge urgent' : 'upcoming-badge';
        
        html += `
            <div class="upcoming-item">
                <span class="upcoming-name">${k.nama || 'Tanpa nama'}</span>
                <span class="upcoming-date">${formatTanggal(k.tanggalMulai)}</span>
                <span class="upcoming-badge">${badgeText}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderTabel(data, filterStatus, filterLokasi) {
    var tbody = document.getElementById('tabelBody');
    var mode = document.getElementById('formKerja').dataset.mode;
    
    var kegiatanList = data.kegiatan || [];
    
    // Filter berdasarkan mode
    if (mode === 'mode1') {
        kegiatanList = kegiatanList.filter(function(k) { 
            return k.status !== 'Selesai' && k.status !== 'Dibatalkan';
        });
    } else if (mode === 'mode2') {
        kegiatanList = kegiatanList.filter(function(k) { 
            return k.status === 'Selesai';
        });
    }
    
    // Filter status
    if (filterStatus && filterStatus !== 'semua') {
        kegiatanList = kegiatanList.filter(function(k) { return k.status === filterStatus; });
    }
    
    // Filter lokasi
    if (filterLokasi && filterLokasi !== 'semua') {
        kegiatanList = kegiatanList.filter(function(k) { return k.lokasi === filterLokasi; });
    }
    
    if (kegiatanList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Tidak ada kegiatan</td></tr>';
        return;
    }
    
    var html = '';
    kegiatanList.forEach(function(kegiatan, index) {
        var statusClass = 'status-rencana';
        if (kegiatan.status === 'Berlangsung') statusClass = 'status-berlangsung';
        if (kegiatan.status === 'Selesai') statusClass = 'status-selesai';
        if (kegiatan.status === 'Dibatalkan') statusClass = 'status-dibatalkan';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${kegiatan.nama || '-'}</strong></td>
                <td>${kegiatan.lokasi || '-'}</td>
                <td>${formatTanggal(kegiatan.tanggalMulai)}</td>
                <td>${formatTanggal(kegiatan.tanggalSelesai)}</td>
                <td><span class="${statusClass}">${kegiatan.status || 'Rencana'}</span></td>
                <td>
                    <div style="display:flex;gap:4px;">
                        ${kegiatan.status !== 'Selesai' ? `<button class="btn-ubah-status" data-id="${kegiatan.id}" title="Ubah Status">🔄</button>` : ''}
                        <button class="btn-hapus" data-id="${kegiatan.id}" title="Hapus">🗑</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Event listeners
    tbody.querySelectorAll('.btn-ubah-status').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            ubahStatusKegiatan(id);
        });
    });
    
    tbody.querySelectorAll('.btn-hapus').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            hapusKegiatan(id);
        });
    });
}

function renderAll() {
    var data = loadData();
    var filterStatus = document.getElementById('filterStatus').value;
    var filterLokasi = document.getElementById('filterLokasi').value;
    
    renderStats(data);
    renderUpcoming(data);
    renderTabel(data, filterStatus, filterLokasi);
    
    // Update filter lokasi options
    updateLokasiFilter(data);
}

function updateLokasiFilter(data) {
    var select = document.getElementById('filterLokasi');
    var lokasiSet = {};
    
    data.kegiatan.forEach(function(k) {
        if (k.lokasi) lokasiSet[k.lokasi] = true;
    });
    
    var currentValue = select.value;
    select.innerHTML = '<option value="semua">Semua</option>';
    
    Object.keys(lokasiSet).sort().forEach(function(lokasi) {
        var option = document.createElement('option');
        option.value = lokasi;
        option.textContent = lokasi;
        select.appendChild(option);
    });
    
    if (currentValue && lokasiSet[currentValue]) {
        select.value = currentValue;
    }
}

// ============================================================
// 4. LOGIC FUNCTIONS
// ============================================================

function tambahKegiatan() {
    var nama = document.getElementById('inputNama').value.trim();
    var lokasi = document.getElementById('inputLokasi').value.trim();
    var deskripsi = document.getElementById('inputDeskripsi').value.trim();
    var tanggalMulai = document.getElementById('inputMulai').value;
    var tanggalSelesai = document.getElementById('inputSelesai').value;
    
    if (!nama) {
        showToast('Nama kegiatan harus diisi!');
        return;
    }
    
    if (!tanggalMulai) {
        showToast('Tanggal mulai harus diisi!');
        return;
    }
    
    // Tentukan status otomatis
    var today = getToday();
    var status = 'Rencana';
    
    if (tanggalMulai <= today && (!tanggalSelesai || tanggalSelesai >= today)) {
        status = 'Berlangsung';
    } else if (tanggalSelesai && tanggalSelesai < today) {
        status = 'Selesai';
    }
    
    var data = loadData();
    if (!data.kegiatan) data.kegiatan = [];
    
    data.kegiatan.push({
        id: generateId(),
        nama: nama,
        lokasi: lokasi || '-',
        deskripsi: deskripsi || '-',
        tanggalMulai: tanggalMulai,
        tanggalSelesai: tanggalSelesai || null,
        status: status,
        createdAt: new Date().toISOString()
    });
    
    saveData(data);
    renderAll();
    
    document.getElementById('inputNama').value = '';
    document.getElementById('inputLokasi').value = '';
    document.getElementById('inputDeskripsi').value = '';
    document.getElementById('inputMulai').value = getToday();
    document.getElementById('inputSelesai').value = getToday();
    
    showToast('✅ Kegiatan berhasil ditambahkan!');
}

function ubahStatusKegiatan(id) {
    var data = loadData();
    if (!data.kegiatan) return;
    
    var kegiatan = data.kegiatan.find(function(k) { return k.id === id; });
    if (!kegiatan) return;
    
    // Status yang tersedia
    var statusOptions = ['Rencana', 'Berlangsung', 'Selesai', 'Dibatalkan'];
    var currentIndex = statusOptions.indexOf(kegiatan.status);
    var nextIndex = (currentIndex + 1) % statusOptions.length;
    var newStatus = statusOptions[nextIndex];
    
    kegiatan.status = newStatus;
    saveData(data);
    renderAll();
    showToast('🔄 Status diubah menjadi: ' + newStatus);
}

function hapusKegiatan(id) {
    if (!confirm('Yakin ingin menghapus kegiatan ini?')) return;
    
    var data = loadData();
    if (!data.kegiatan) return;
    
    data.kegiatan = data.kegiatan.filter(function(k) { return k.id !== id; });
    saveData(data);
    renderAll();
    showToast('🗑 Kegiatan dihapus');
}

// ============================================================
// 5. EVENT LISTENERS
// ============================================================

// Menu Utama
document.getElementById('btnMode1').addEventListener('click', function() {
    renderFormKerja('mode1');
});

document.getElementById('btnMode2').addEventListener('click', function() {
    renderFormKerja('mode2');
});

// Kembali ke Menu
document.getElementById('btnKembaliMenu').addEventListener('click', function() {
    renderMenuUtama();
});

// Tambah Kegiatan
document.getElementById('btnTambahKegiatan').addEventListener('click', function() {
    tambahKegiatan();
});

// Enter key untuk tambah kegiatan
document.getElementById('inputNama').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        tambahKegiatan();
    }
});

// Filter
document.getElementById('filterStatus').addEventListener('change', renderAll);
document.getElementById('filterLokasi').addEventListener('change', renderAll);

// ============================================================
// 6. INITIALIZATION
// ============================================================

function init() {
    var today = getToday();
    document.getElementById('inputMulai').value = today;
    document.getElementById('inputSelesai').value = today;
    
    renderMenuUtama();
    console.log('🚀 MahaMate - Program Kegiatan siap digunakan!');
}

document.addEventListener('DOMContentLoaded', init);