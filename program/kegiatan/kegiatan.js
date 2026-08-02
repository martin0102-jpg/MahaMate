// ============================================================
// PROGRAM KEGIATAN - MAHAMATE
// ============================================================

console.log('🔧 Inisialisasi Program Kegiatan...');

// ============================================================
// 1. KONFIGURASI
// ============================================================

const API_URL = 'http://localhost:3000/api/kegiatan';

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
    
    toast.textContent = message;
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

function getStatusClass(status) {
    var classes = {
        'Rencana': 'status-rencana',
        'Berlangsung': 'status-berlangsung',
        'Selesai': 'status-selesai',
        'Dibatalkan': 'status-dibatalkan'
    };
    return classes[status] || 'status-rencana';
}

function getStatusColor(status) {
    var colors = {
        'Rencana': '#004085',
        'Berlangsung': '#856404',
        'Selesai': '#155724',
        'Dibatalkan': '#721c24'
    };
    return colors[status] || '#004085';
}

function getNextStatus(status) {
    var statusList = ['Rencana', 'Berlangsung', 'Selesai', 'Dibatalkan'];
    var currentIndex = statusList.indexOf(status);
    if (currentIndex === -1) return 'Rencana';
    var nextIndex = (currentIndex + 1) % statusList.length;
    return statusList[nextIndex];
}

// ============================================================
// 4. DATA FUNCTIONS
// ============================================================

// ===== 4a. STORAGE KEY =====
var STORAGE_KEY = 'kegiatan_data';

// ===== 4b. LOAD DATA =====
function loadData() {
    var data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { kegiatan: [] };
    try {
        return JSON.parse(data);
    } catch (e) {
        return { kegiatan: [] };
    }
}

// ===== 4c. SAVE DATA =====
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('💾 Data kegiatan disimpan');
}

// ============================================================
// 5. DOM FUNCTIONS
// ============================================================

function renderStats(data) {
    var total = data.kegiatan.length;
    var selesai = data.kegiatan.filter(function(k) { return k.status === 'Selesai'; }).length;
    var aktif = data.kegiatan.filter(function(k) { 
        return k.status === 'Berlangsung';
    }).length;
    var rencana = data.kegiatan.filter(function(k) { 
        return k.status === 'Rencana';
    }).length;
    
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statSelesai').textContent = selesai;
    document.getElementById('statAktif').textContent = aktif;
    document.getElementById('statRencana').textContent = rencana;
}

function updateLokasiFilter() {
    var data = loadData();
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

function renderTabel(data, filterStatus, filterLokasi) {
    var tbody = document.getElementById('tabelBody');
    
    var kegiatanList = data.kegiatan || [];
    
    // Filter status
    if (filterStatus && filterStatus !== 'semua') {
        kegiatanList = kegiatanList.filter(function(k) { return k.status === filterStatus; });
    }
    
    // Filter lokasi
    if (filterLokasi && filterLokasi !== 'semua') {
        kegiatanList = kegiatanList.filter(function(k) { return k.lokasi === filterLokasi; });
    }
    
    if (kegiatanList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Tidak ada kegiatan</td></tr>';
        return;
    }
    
    var html = '';
    kegiatanList.forEach(function(kegiatan, index) {
        var statusClass = getStatusClass(kegiatan.status);
        
        html += `
            <tr class="clickable-row" data-id="${kegiatan.id}">
                <td>${index + 1}</td>
                <td><strong>${kegiatan.nama || '-'}</strong></td>
                <td>${kegiatan.lokasi || '-'}</td>
                <td>${formatTanggal(kegiatan.tanggalMulai)}</td>
                <td>${kegiatan.tanggalSelesai ? formatTanggal(kegiatan.tanggalSelesai) : '-'}</td>
                <td><span class="${statusClass}">${kegiatan.status || 'Rencana'}</span></td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Event listener untuk klik baris (buka preview)
    tbody.querySelectorAll('.clickable-row').forEach(function(row) {
        row.addEventListener('click', function() {
            var id = this.dataset.id;
            openPreview(id);
        });
    });
}

function renderAll() {
    var data = loadData();
    var filterStatus = document.getElementById('filterStatus').value;
    var filterLokasi = document.getElementById('filterLokasi').value;
    
    renderStats(data);
    renderTabel(data, filterStatus, filterLokasi);
    updateLokasiFilter();
}

// ============================================================
// 6. PREVIEW POPUP
// ============================================================

function openPreview(id) {
    var data = loadData();
    var kegiatan = data.kegiatan.find(function(k) { return k.id === id; });
    
    if (!kegiatan) {
        showToast('Kegiatan tidak ditemukan', 'danger');
        return;
    }
    
    // Isi data preview
    document.getElementById('previewNama').textContent = kegiatan.nama || '-';
    document.getElementById('previewDeskripsi').textContent = kegiatan.deskripsi || '-';
    document.getElementById('previewLokasi').textContent = kegiatan.lokasi || '-';
    document.getElementById('previewMulai').textContent = formatTanggal(kegiatan.tanggalMulai);
    document.getElementById('previewSelesai').textContent = kegiatan.tanggalSelesai ? formatTanggal(kegiatan.tanggalSelesai) : '-';
    document.getElementById('previewStatus').textContent = kegiatan.status || 'Rencana';
    document.getElementById('previewStatus').style.color = getStatusColor(kegiatan.status);
    document.getElementById('previewCreated').textContent = kegiatan.createdAt ? formatTanggal(kegiatan.createdAt.split('T')[0]) : '-';
    
    document.getElementById('btnPreviewStatus').dataset.id = kegiatan.id;
    document.getElementById('btnPreviewHapus').dataset.id = kegiatan.id;
    
    document.getElementById('previewOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    document.getElementById('previewOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// 7. LOGIC FUNCTIONS
// ============================================================

function tambahKegiatan() {
    var nama = document.getElementById('inputNama').value.trim();
    var lokasi = document.getElementById('inputLokasi').value.trim();
    var deskripsi = document.getElementById('inputDeskripsi').value.trim();
    var tanggalMulai = document.getElementById('inputMulai').value;
    var tanggalSelesai = document.getElementById('inputSelesai').value;
    
    if (!nama) {
        showToast('Nama kegiatan harus diisi!', 'danger');
        return;
    }
    
    if (!tanggalMulai) {
        showToast('Tanggal mulai harus diisi!', 'danger');
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
    updateLokasiFilter();
    
    document.getElementById('inputNama').value = '';
    document.getElementById('inputLokasi').value = '';
    document.getElementById('inputDeskripsi').value = '';
    document.getElementById('inputMulai').value = getToday();
    document.getElementById('inputSelesai').value = getToday();
    
    showToast('✅ Kegiatan berhasil ditambahkan!', 'success');
}

function ubahStatusKegiatan(id) {
    var data = loadData();
    if (!data.kegiatan) return;
    
    var kegiatan = data.kegiatan.find(function(k) { return k.id === id; });
    if (!kegiatan) return;
    
    var newStatus = getNextStatus(kegiatan.status);
    kegiatan.status = newStatus;
    
    saveData(data);
    renderAll();
    closePreview();
    showToast('🔄 Status diubah menjadi: ' + newStatus, 'info');
}

function hapusKegiatan(id) {
    if (!confirm('Yakin ingin menghapus kegiatan ini?')) return;
    
    var data = loadData();
    if (!data.kegiatan) return;
    
    data.kegiatan = data.kegiatan.filter(function(k) { return k.id !== id; });
    saveData(data);
    renderAll();
    updateLokasiFilter();
    closePreview();
    showToast('🗑 Kegiatan dihapus', 'warning');
}

// ============================================================
// 8. EVENT LISTENERS
// ============================================================

// ===== TAMBAH KEGIATAN =====
document.getElementById('btnTambahKegiatan').addEventListener('click', function() {
    tambahKegiatan();
});

// ===== ENTER KEY UNTUK TAMBAH KEGIATAN =====
document.getElementById('inputNama').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        tambahKegiatan();
    }
});

// ===== FILTER =====
document.getElementById('filterStatus').addEventListener('change', renderAll);
document.getElementById('filterLokasi').addEventListener('change', renderAll);

// ===== PREVIEW POPUP - CLOSE =====
document.getElementById('previewClose').addEventListener('click', closePreview);
document.getElementById('previewOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closePreview();
    }
});

// ===== PREVIEW POPUP - TOMBOL STATUS =====
document.getElementById('btnPreviewStatus').addEventListener('click', function() {
    var id = this.dataset.id;
    if (id) {
        ubahStatusKegiatan(id);
    }
});

// ===== PREVIEW POPUP - TOMBOL HAPUS =====
document.getElementById('btnPreviewHapus').addEventListener('click', function() {
    var id = this.dataset.id;
    if (id) {
        hapusKegiatan(id);
    }
});

// ===== ESC UNTUK TUTUP PREVIEW =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePreview();
        closeLogoutPopup();
    }
});

// ============================================================
// 9. INITIALIZATION
// ============================================================

function init() {
    document.getElementById('inputMulai').value = getToday();
    document.getElementById('inputSelesai').value = getToday();
    
    // LANGSUNG RENDER TANPA MENU
    renderAll();
    
    console.log('🚀 MahaMate - Program Kegiatan siap digunakan!');
}

document.addEventListener('DOMContentLoaded', init);

console.log('✅ Semua fungsi siap digunakan!');