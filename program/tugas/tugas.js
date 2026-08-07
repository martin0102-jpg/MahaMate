// ============================================================
// PROGRAM TUGAS - MAHAMATE
// ============================================================

console.log('🔧 Inisialisasi Program Tugas...');

// ============================================================
// 1. KONFIGURASI API
// ============================================================

const API_URL = 'http://localhost:3000/api/tugas';

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

function isDeadlineOverdue(deadline) {
    if (!deadline) return false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < today;
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
        'Belum Mulai': 'status-belum',
        'Sedang Dikerjakan': 'status-proses',
        'Selesai': 'status-selesai'
    };
    return classes[status] || 'status-belum';
}

function getStatusColor(status) {
    var colors = {
        'Belum Mulai': '#6c757d',
        'Sedang Dikerjakan': '#ffc107',
        'Selesai': '#28a745'
    };
    return colors[status] || '#6c757d';
}

// ============================================================
// 4. DATA FUNCTIONS (API)
// ============================================================

// ===== 4a. LOAD DATA DARI API =====
async function loadData() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result.success) {
            return { tugas: result.data };
        }
        return { tugas: [] };
    } catch (error) {
        console.error('❌ Error load data:', error);
        showToast('Gagal memuat data dari server', 'danger');
        return { tugas: [] };
    }
}

// ============================================================
// 5. DOM FUNCTIONS
// ============================================================

function renderStats(data) {
    var total = data.tugas.length;
    var selesai = data.tugas.filter(function(t) { return t.status === 'Selesai'; }).length;
    var aktif = data.tugas.filter(function(t) { return t.status !== 'Selesai'; }).length;
    var terlambat = data.tugas.filter(function(t) { 
        return t.status !== 'Selesai' && isDeadlineOverdue(t.deadline);
    }).length;
    
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statSelesai').textContent = selesai;
    document.getElementById('statAktif').textContent = aktif;
    document.getElementById('statTerlambat').textContent = terlambat;
}

function renderTabel(data, filterKategori, filterPrioritas, filterStatus, sortBy) {
    var tbody = document.getElementById('tabelBody');
    
    var tugasList = data.tugas || [];
    
    // Filter kategori
    if (filterKategori && filterKategori !== 'semua') {
        tugasList = tugasList.filter(function(t) { return t.kategori === filterKategori; });
    }
    
    // Filter prioritas
    if (filterPrioritas && filterPrioritas !== 'semua') {
        tugasList = tugasList.filter(function(t) { return t.prioritas === filterPrioritas; });
    }
    
    // Filter status
    if (filterStatus && filterStatus !== 'semua') {
        tugasList = tugasList.filter(function(t) { return t.status === filterStatus; });
    }
    
    // Sorting
    if (sortBy === 'deadline') {
        tugasList.sort(function(a, b) {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return a.deadline.localeCompare(b.deadline);
        });
    } else if (sortBy === 'createdAt') {
        tugasList.sort(function(a, b) {
            return b.createdAt.localeCompare(a.createdAt);
        });
    } else if (sortBy === 'judul') {
        tugasList.sort(function(a, b) {
            return a.judul.localeCompare(b.judul);
        });
    }
    
    if (tugasList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Tidak ada tugas</td></tr>';
        return;
    }
    
    var html = '';
    tugasList.forEach(function(tugas, index) {
        var priorityClass = 'priority-rendah';
        if (tugas.prioritas === 'Sedang') priorityClass = 'priority-sedang';
        if (tugas.prioritas === 'Tinggi') priorityClass = 'priority-tinggi';
        
        var statusClass = getStatusClass(tugas.status);
        if (tugas.status !== 'Selesai' && isDeadlineOverdue(tugas.deadline)) {
            statusClass = 'status-terlambat';
        }
        
        html += `
            <tr class="clickable-row" data-id="${tugas.id}">
                <td>${index + 1}</td>
                <td><strong>${tugas.judul || '-'}</strong></td>
                <td>${tugas.kategori || '-'}</td>
                <td><span class="${priorityClass}">${tugas.prioritas || '-'}</span></td>
                <td>${formatTanggal(tugas.deadline)}</td>
                <td><span class="${statusClass}">${tugas.status || 'Belum Mulai'}</span></td>
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

async function renderAll() {
    const data = await loadData();
    var filterKategori = document.getElementById('filterKategori').value;
    var filterPrioritas = document.getElementById('filterPrioritas').value;
    var filterStatus = document.getElementById('filterStatus').value;
    var sortBy = document.getElementById('sortBy').value;
    
    renderStats(data);
    renderTabel(data, filterKategori, filterPrioritas, filterStatus, sortBy);
}

// ============================================================
// 6. PREVIEW POPUP
// ============================================================

async function openPreview(id) {
    try {
        const data = await loadData();
        var tugas = data.tugas.find(function(t) { return t.id == id; });
        
        if (!tugas) {
            showToast('Tugas tidak ditemukan', 'danger');
            return;
        }
        
        // Isi data preview
        document.getElementById('previewJudul').textContent = tugas.judul || '-';
        document.getElementById('previewDeskripsi').textContent = tugas.deskripsi || '-';
        document.getElementById('previewKategori').textContent = tugas.kategori || '-';
        document.getElementById('previewPrioritas').textContent = tugas.prioritas || '-';
        document.getElementById('previewDeadline').textContent = formatTanggal(tugas.deadline);
        document.getElementById('previewStatus').textContent = tugas.status || 'Belum Mulai';
        document.getElementById('previewStatus').style.color = getStatusColor(tugas.status);
        document.getElementById('previewCreated').textContent = tugas.createdAt ? formatTanggal(tugas.createdAt.split('T')[0]) : '-';
        
        // Tombol "Selesai" hanya jika belum selesai
        var btnSelesai = document.getElementById('btnPreviewSelesai');
        if (tugas.status === 'Selesai') {
            btnSelesai.style.display = 'none';
        } else {
            btnSelesai.style.display = 'inline-flex';
            btnSelesai.dataset.id = tugas.id;
        }
        
        document.getElementById('btnPreviewHapus').dataset.id = tugas.id;
        
        document.getElementById('previewOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('❌ Error open preview:', error);
        showToast('Gagal membuka detail tugas', 'danger');
    }
}

function closePreview() {
    document.getElementById('previewOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// 7. LOGIC FUNCTIONS (CRUD - API)
// ============================================================

// ===== TAMBAH TUGAS =====
async function tambahTugas() {
    var judul = document.getElementById('inputJudul').value.trim();
    var deskripsi = document.getElementById('inputDeskripsi').value.trim();
    var kategori = document.getElementById('inputKategori').value;
    var prioritas = document.getElementById('inputPrioritas').value;
    var deadline = document.getElementById('inputDeadline').value;
    
    if (!judul) {
        showToast('Judul tugas harus diisi!', 'danger');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                judul,
                deskripsi: deskripsi || '-',
                kategori,
                prioritas,
                deadline: deadline || null,
                status: 'Belum Mulai'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('inputJudul').value = '';
            document.getElementById('inputDeskripsi').value = '';
            document.getElementById('inputDeadline').value = getToday();
            
            await renderAll();
            showToast('✅ Tugas berhasil ditambahkan!', 'success');
        } else {
            showToast(result.message || 'Gagal menambahkan tugas', 'danger');
        }
    } catch (error) {
        console.error('❌ Error tambah tugas:', error);
        showToast('Gagal menambahkan tugas', 'danger');
    }
}

// ===== TANDAI SELESAI =====
async function tandaiSelesai(id) {
    try {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Selesai' })
        });
        
        const result = await response.json();
        
        if (result.success) {
            await renderAll();
            closePreview();
            showToast('✅ Tugas ditandai selesai!', 'success');
        } else {
            showToast(result.message || 'Gagal update status', 'danger');
        }
    } catch (error) {
        console.error('❌ Error tandai selesai:', error);
        showToast('Gagal update status', 'danger');
    }
}

// ===== HAPUS TUGAS =====
async function hapusTugas(id) {
    if (!confirm('Yakin ingin menghapus tugas ini?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            await renderAll();
            closePreview();
            showToast('🗑 Tugas dihapus', 'warning');
        } else {
            showToast(result.message || 'Gagal menghapus tugas', 'danger');
        }
    } catch (error) {
        console.error('❌ Error hapus tugas:', error);
        showToast('Gagal menghapus tugas', 'danger');
    }
}

// ============================================================
// 8. EVENT LISTENERS
// ============================================================

// ===== TAMBAH TUGAS =====
document.getElementById('btnTambahTugas').addEventListener('click', function() {
    tambahTugas();
});

// ===== ENTER KEY UNTUK TAMBAH TUGAS =====
document.getElementById('inputJudul').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        tambahTugas();
    }
});

// ===== FILTER & SORT =====
document.getElementById('filterKategori').addEventListener('change', renderAll);
document.getElementById('filterPrioritas').addEventListener('change', renderAll);
document.getElementById('filterStatus').addEventListener('change', renderAll);
document.getElementById('sortBy').addEventListener('change', renderAll);

// ===== PREVIEW POPUP - CLOSE =====
document.getElementById('previewClose').addEventListener('click', closePreview);
document.getElementById('previewOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closePreview();
    }
});

// ===== PREVIEW POPUP - TOMBOL SELESAI =====
document.getElementById('btnPreviewSelesai').addEventListener('click', function() {
    var id = this.dataset.id;
    if (id) {
        tandaiSelesai(id);
    }
});

// ===== PREVIEW POPUP - TOMBOL HAPUS =====
document.getElementById('btnPreviewHapus').addEventListener('click', function() {
    var id = this.dataset.id;
    if (id) {
        hapusTugas(id);
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

async function init() {
    document.getElementById('inputDeadline').value = getToday();
    
    // LANGSUNG RENDER TANPA MENU
    await renderAll();
    
    console.log('🚀 MahaMate - Program Tugas siap digunakan!');
    console.log('📡 API:', API_URL);
}

document.addEventListener('DOMContentLoaded', init);

console.log('✅ Semua fungsi siap digunakan!');