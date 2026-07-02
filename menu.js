// ============================================================
// BAGIAN 1: REAL-TIME CLOCK (Jam Berjalan)
// ============================================================

function updateDateTime() {
    var now = new Date();

    // Nama hari
    var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var dayName = days[now.getDay()];

    // Format waktu (HH.MM)
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var timeString = hours + '.' + minutes;

    // Format tanggal (DD Month YYYY)
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var day = now.getDate();
    var month = months[now.getMonth()];
    var year = now.getFullYear();
    var dateString = day + ' ' + month + ' ' + year;

    // Update ke HTML
    document.getElementById('dayName').textContent = dayName;
    document.getElementById('timeDisplay').textContent = timeString;
    document.getElementById('dateDisplay').textContent = dateString;
}

// Jalankan pertama kali
updateDateTime();

// Update setiap 1 detik
setInterval(updateDateTime, 1000);


// ============================================================
// BAGIAN 2: SIDEBAR TOGGLE (Kecil/Besar)
// ============================================================

var sidebar = document.querySelector(".sidebar");
var sidebarToggler = document.getElementById("sidebarToggler");
var dropdownToggles = document.querySelectorAll(".dropdown-toggle");
var overlay = document.getElementById("sidebarOverlay");

// Klik tombol toggle
sidebarToggler.addEventListener("click", function() {
    // Toggle class 'collapsed'
    sidebar.classList.toggle("collapsed");
    
    // Tutup semua dropdown saat sidebar collapsed
    if (sidebar.classList.contains("collapsed")) {
        document.querySelectorAll(".dropdown-container").forEach(function(container) {
            container.classList.remove("open");
            var toggle = container.querySelector(".dropdown-toggle");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
    }
});


// ============================================================
// BAGIAN 3: DROPDOWN TOGGLE (Buka/Tutup)
// ============================================================

dropdownToggles.forEach(function(toggle) {
    toggle.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Jika sidebar collapsed, skip (pakai hover)
        if (sidebar.classList.contains("collapsed")) return;

        var currentContainer = this.parentElement;
        var isOpen = currentContainer.classList.contains("open");

        // Tutup semua dropdown lain
        document.querySelectorAll(".dropdown-container").forEach(function(container) {
            container.classList.remove("open");
            var btn = container.querySelector(".dropdown-toggle");
            if (btn) btn.setAttribute("aria-expanded", "false");
        });

        // Toggle dropdown yang diklik
        if (!isOpen) {
            currentContainer.classList.add("open");
            this.setAttribute("aria-expanded", "true");
        } else {
            this.setAttribute("aria-expanded", "false");
        }
    });
});


// ============================================================
// BAGIAN 4: TUTUP DROPDOWN SAAT KLIK DI LUAR
// ============================================================

document.addEventListener("click", function(e) {
    if (!sidebar.contains(e.target) && !sidebar.classList.contains("collapsed")) {
        document.querySelectorAll(".dropdown-container").forEach(function(container) {
            container.classList.remove("open");
            var toggle = container.querySelector(".dropdown-toggle");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
    }
});


// ============================================================
// BAGIAN 5: ACTIVE LINK & NAVIGASI
// ============================================================

document.querySelectorAll(".nav-link:not(.dropdown-toggle)").forEach(function(link) {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        
        document.querySelectorAll(".nav-link:not(.dropdown-toggle)").forEach(function(l) {
            l.classList.remove("active");
        });
        
        this.classList.add("active");
        
        var page = this.dataset.page;
        if (page) {
            navigateTo(page);
        }
    });
});

document.querySelectorAll(".program-card, .dropdown-link[data-page]").forEach(function(item) {
    item.addEventListener("click", function(e) {
        e.preventDefault();
        var page = this.dataset.page;
        if (page) {
            navigateTo(page);
        }
    });
});


// ============================================================
// BAGIAN 6: FUNGSI NAVIGASI
// ============================================================

function navigateTo(page) {
    console.log('📱 Navigasi ke:', page);
    
    document.querySelectorAll(".nav-link[data-page]").forEach(function(link) {
        link.classList.remove("active");
        if (link.dataset.page === page) {
            link.classList.add("active");
        }
    });
    
    var pageNames = {
        'dashboard': 'Dashboard',
        'tugas': 'Manajemen Tugas',
        'keuangan': 'Manajemen Keuangan',
        'kegiatan': 'Manajemen Kegiatan',
        'settings': 'Pengaturan',
        'profile': 'Profile'
    };
    
    var name = pageNames[page] || page;
    showNotification('📋 Membuka halaman: ' + name);
}


// ============================================================
// BAGIAN 7: NOTIFIKASI SEDERHANA
// ============================================================

function showNotification(message) {
    var notif = document.querySelector('.custom-notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.className = 'custom-notification';
        document.body.appendChild(notif);
    }
    
    notif.textContent = message;
    notif.style.display = 'block';
    notif.style.opacity = '1';
    
    clearTimeout(notif._timeout);
    notif._timeout = setTimeout(function() {
        notif.style.opacity = '0';
        setTimeout(function() {
            notif.style.display = 'none';
        }, 300);
    }, 2000);
}


// ============================================================
// BAGIAN 8: MOBILE RESPONSIVE
// ============================================================

function toggleMobileSidebar() {
    if (window.innerWidth <= 576) {
        sidebar.classList.toggle("mobile-open");
        overlay.classList.toggle("active");
        if (sidebar.classList.contains("mobile-open")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }
}

sidebarToggler.addEventListener("click", function(e) {
    if (window.innerWidth <= 576) {
        e.stopPropagation();
        toggleMobileSidebar();
    }
});

overlay.addEventListener("click", function() {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
});

var resizeTimeout;
window.addEventListener("resize", function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (window.innerWidth > 576) {
            sidebar.classList.remove("mobile-open");
            overlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    }, 250);
});


// ============================================================
// BAGIAN 9: KEYBOARD ACCESSIBILITY (ESC)
// ============================================================

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        document.querySelectorAll(".dropdown-container.open").forEach(function(container) {
            container.classList.remove("open");
            var toggle = container.querySelector(".dropdown-toggle");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
        
        if (sidebar.classList.contains("mobile-open")) {
            sidebar.classList.remove("mobile-open");
            overlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    }
});


// ============================================================
// BAGIAN 10: DARK MODE THEME
// ============================================================

document.querySelectorAll('[data-theme]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var theme = this.dataset.theme;
        
        // Hapus class dark dari body
        document.body.classList.remove('dark-mode');
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            showNotification('🌙 Mode Dark diaktifkan');
        } else if (theme === 'light') {
            showNotification('☀️ Mode Light diaktifkan');
        } else if (theme === 'system') {
            // Cek preferensi sistem
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
            }
            showNotification('💻 Mengikuti tema sistem');
        }
    });
});


// ============================================================
// BAGIAN 11: FOOTER LINKS (Program & Kontak)
// ============================================================

document.querySelectorAll('.footer-program .footer-links a[data-page]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var page = this.dataset.page;
        if (page) {
            navigateTo(page);
        }
    });
});

document.querySelectorAll('.footer-kontak .footer-links a[data-contact]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var contact = this.dataset.contact;
        showNotification('📱 Membuka kontak: ' + contact);
        console.log('📱 Kontak:', contact);
    });
});

console.log('🚀 MahaMate Dashboard siap digunakan!');