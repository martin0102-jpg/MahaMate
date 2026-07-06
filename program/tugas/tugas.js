// ============================================================
// PROGRAM TUGAS - MAHAMATE
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

function isDeadlineOverdue(deadline) {
    if (!deadline) return false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < today;
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

var STORAGE_KEY = 'tugas_data';

function loadData() {
    var data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { tugas: [] };
    try {
        return JSON.parse(data);
    } catch (e) {
        return { tugas: [] };
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
        title.textContent = '📋 Mode: Daftar Tugas Aktif';
    } else {
        title.textContent = '✅ Mode: Tugas Selesai';
    }
    
    document.getElementById('formKerja').dataset.mode = mode;
    
    // Reset form
    document.getElementById('inputJudul').value = '';
    document.getElementById('inputDeskripsi').value = '';
    document.getElementById('inputDeadline').value = getToday();
    document.getElementById('inputPrioritas').value = 'Sedang';
    document.getElementById('inputKategori').value = 'Pribadi';
    
    renderAll();
}

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
    var mode = document.getElementById('formKerja').dataset.mode;
    
    var tugasList = data.tugas || [];
    
    // Filter berdasarkan mode
    if (mode === 'mode1') {
        tugasList = tugasList.filter(function(t) { return t.status !== 'Selesai'; });
    } else if (mode === 'mode2') {
        tugasList = tugasList.filter(function(t) { return t.status === 'Selesai'; });
    }
    
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
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Tidak ada tugas</td></tr>';
        return;
    }
    
    var html = '';
    tugasList.forEach(function(tugas, index) {
        var priorityClass = 'priority-rendah';
        if (tugas.prioritas === 'Sedang') priorityClass = 'priority-sedang';
        if (tugas.prioritas === 'Tinggi') priorityClass = 'priority-tinggi';
        
        var statusClass = 'status-belum';
        if (tugas.status === 'Sedang Dikerjakan') statusClass = 'status-proses';
        if (tugas.status === 'Selesai') statusClass = 'status-selesai';
        if (tugas.status !== 'Selesai' && isDeadlineOverdue(tugas.deadline)) statusClass = 'status-terlambat';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${tugas.judul || '-'}</strong></td>
                <td>${tugas.kategori || '-'}</td>
                <td><span class="${priorityClass}">${tugas.prioritas || '-'}</span></td>
                <td>${formatTanggal(tugas.deadline)}</td>
                <td><span class="${statusClass}">${tugas.status || 'Belum Mulai'}</span></td>
                <td>
                    <div style="display:flex;gap:4px;">
                        ${tugas.status !== 'Selesai' ? `<button class="btn-selesai" data-id="${tugas.id}" title="Tandai Selesai">✅</button>` : ''}
                        <button class="btn-hapus" data-id="${tugas.id}" title="Hapus">🗑</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Event listeners
    tbody.querySelectorAll('.btn-selesai').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            tandaiSelesai(id);
        });
    });
    
    tbody.querySelectorAll('.btn-hapus').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            hapusTugas(id);
        });
    });
}

function renderAll() {
    var data = loadData();
    var filterKategori = document.getElementById('filterKategori').value;
    var filterPrioritas = document.getElementById('filterPrioritas').value;
    var filterStatus = document.getElementById('filterStatus').value;
    var sortBy = document.getElementById('sortBy').value;
    
    renderStats(data);
    renderTabel(data, filterKategori, filterPrioritas, filterStatus, sortBy);
}

// ============================================================
// 4. LOGIC FUNCTIONS
// ============================================================

function tambahTugas() {
    var judul = document.getElementById('inputJudul').value.trim();
    var deskripsi = document.getElementById('inputDeskripsi').value.trim();
    var kategori = document.getElementById('inputKategori').value;
    var prioritas = document.getElementById('inputPrioritas').value;
    var deadline = document.getElementById('inputDeadline').value;
    
    if (!judul) {
        showToast('Judul tugas harus diisi!');
        return;
    }
    
    var data = loadData();
    if (!data.tugas) data.tugas = [];
    
    data.tugas.push({
        id: generateId(),
        judul: judul,
        deskripsi: deskripsi || '-',
        kategori: kategori,
        prioritas: prioritas,
        deadline: deadline || null,
        status: 'Belum Mulai',
        createdAt: new Date().toISOString()
    });
    
    saveData(data);
    renderAll();
    
    document.getElementById('inputJudul').value = '';
    document.getElementById('inputDeskripsi').value = '';
    document.getElementById('inputDeadline').value = getToday();
    
    showToast('✅ Tugas berhasil ditambahkan!');
}

function tandaiSelesai(id) {
    var data = loadData();
    if (!data.tugas) return;
    
    var tugas = data.tugas.find(function(t) { return t.id === id; });
    if (tugas) {
        tugas.status = 'Selesai';
        saveData(data);
        renderAll();
        showToast('✅ Tugas ditandai selesai!');
    }
}

function hapusTugas(id) {
    if (!confirm('Yakin ingin menghapus tugas ini?')) return;
    
    var data = loadData();
    if (!data.tugas) return;
    
    data.tugas = data.tugas.filter(function(t) { return t.id !== id; });
    saveData(data);
    renderAll();
    showToast('🗑 Tugas dihapus');
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

// Tambah Tugas
document.getElementById('btnTambahTugas').addEventListener('click', function() {
    tambahTugas();
});

// Enter key untuk tambah tugas
document.getElementById('inputJudul').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        tambahTugas();
    }
});

// Filter & Sort
document.getElementById('filterKategori').addEventListener('change', renderAll);
document.getElementById('filterPrioritas').addEventListener('change', renderAll);
document.getElementById('filterStatus').addEventListener('change', renderAll);
document.getElementById('sortBy').addEventListener('change', renderAll);

// ============================================================
// 6. INITIALIZATION
// ============================================================

function init() {
    document.getElementById('inputDeadline').value = getToday();
    renderMenuUtama();
    console.log('🚀 MahaMate - Program Tugas siap digunakan!');
}

document.addEventListener('DOMContentLoaded', init);