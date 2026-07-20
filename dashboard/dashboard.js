// ============================================================
// MAHAMATE - DASHBOARD
// ============================================================
// 1. REAL-TIME CLOCK
// 2. SIDEBAR TOGGLE
// 3. DROPDOWN TOGGLE
// 4. THEME TOGGLE
// 5. LOGIN SYSTEM
// 6. NAVIGASI
// 7. NOTIFIKASI
// 8. INITIALIZATION
// ============================================================

// ============================================================
// 1. REAL-TIME CLOCK
// ============================================================

function updateDateTime() {
    var now = new Date();

    var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var dayName = days[now.getDay()];

    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var timeString = hours + '.' + minutes;

    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var day = now.getDate();
    var month = months[now.getMonth()];
    var year = now.getFullYear();
    var dateString = day + ' ' + month + ' ' + year;

    document.getElementById('dayName').textContent = dayName;
    document.getElementById('timeDisplay').textContent = timeString;
    document.getElementById('dateDisplay').textContent = dateString;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ============================================================
// 2. SIDEBAR TOGGLE
// ============================================================

var sidebar = document.getElementById('sidebar');
var sidebarOverlay = document.getElementById('sidebarOverlay');
var menuToggle = document.getElementById('menuToggle');
var sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSidebar();
        closeLoginPopup();
    }
});

// ============================================================
// 3. DROPDOWN TOGGLE (Sidebar)
// ============================================================

var dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var parent = this.closest('.sidebar-item');
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

// ============================================================
// 4. THEME TOGGLE
// ============================================================

var themeToggle = document.getElementById('themeToggle');
var themeIcon = document.getElementById('themeIcon');
var isDark = localStorage.getItem('theme') === 'dark';

if (isDark) {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = 'light_mode';
}

themeToggle.addEventListener('click', function() {
    isDark = !isDark;
    
    if (isDark) {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = 'light_mode';
        localStorage.setItem('theme', 'dark');
        showToast('🌙 Mode Dark diaktifkan');
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.textContent = 'dark_mode';
        localStorage.setItem('theme', 'light');
        showToast('☀️ Mode Light diaktifkan');
    }
});

// ============================================================
// 5. LOGIN SYSTEM
// ============================================================

// ===== 5a. Data User =====

var USERS_KEY = 'mahamate_users';
var SESSION_KEY = 'mahamate_session';

function getDefaultUsers() {
    return [
        {
            username: 'admin',
            password: 'admin123',
            name: 'Administrator',
            registeredAt: '2026-07-01'
        },
        {
            username: 'user',
            password: 'user123',
            name: 'Pengguna',
            registeredAt: '2026-07-02'
        }
    ];
}

function getUsers() {
    var data = localStorage.getItem(USERS_KEY);
    if (!data) {
        var defaultUsers = getDefaultUsers();
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return getDefaultUsers();
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
    var data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

function saveSession(username, name) {
    var session = {
        username: username,
        name: name,
        loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

function isLoggedIn() {
    return getSession() !== null;
}

function getCurrentUser() {
    var session = getSession();
    if (!session) return null;
    var users = getUsers();
    return users.find(function(u) { return u.username === session.username; });
}

// ===== 5b. Login Functions =====

function loginUser(username, password) {
    var users = getUsers();
    var user = users.find(function(u) { 
        return u.username === username && u.password === password;
    });
    
    if (user) {
        saveSession(username, user.name);
        return { success: true, user: user };
    }
    return { success: false, message: 'Username atau password salah!' };
}

function registerUser(username, password, name) {
    var users = getUsers();
    
    var existing = users.find(function(u) { return u.username === username; });
    if (existing) {
        return { success: false, message: 'Username sudah terdaftar!' };
    }
    
    users.push({
        username: username,
        password: password,
        name: name || username,
        registeredAt: new Date().toISOString().split('T')[0]
    });
    
    saveUsers(users);
    return { success: true, message: 'Registrasi berhasil! Silakan login.' };
}

// ===== 5c. UI Update =====

function updateUIForLogin() {
    var session = getSession();
    var loginIcon = document.getElementById('loginIcon');
    var btnLogin = document.getElementById('btnLoginIcon');
    var profileText = document.getElementById('profileText');
    var welcomeTitle = document.getElementById('welcomeTitle');
    var welcomeSlogan = document.getElementById('welcomeSlogan');
    var loginBadge = document.getElementById('loginBadge');
    
    var programCards = document.querySelectorAll('.program-card');
    var programLock = document.querySelectorAll('.program-lock');
    var guestMessage = document.getElementById('guestMessage');
    var programMenu = document.getElementById('programMenu');
    var cardBtns = document.querySelectorAll('.card-btn');
    
    if (session) {
        // ===== LOGGED IN =====
        btnLogin.classList.add('logged-in');
        loginIcon.textContent = 'account_circle';
        btnLogin.title = session.name + ' (Klik untuk logout)';
        
        profileText.textContent = session.name;
        
        // Update welcome title with username
        if (welcomeTitle) {
            welcomeTitle.innerHTML = 
                'SELAMAT DATANG DI <span class="highlight-maha">Maha</span><span class="highlight-mate">Mate</span>, <span style="color:#FFE600;">' + session.name + '</span>';
        }
        
        // Update slogan (tetap)
        if (welcomeSlogan) {
            welcomeSlogan.innerHTML = 'Membantu Kamu <span>memanage</span> Keuangan, Tugas, Dan Kegiatan';
        }
        
        // Hilangkan lock
        programLock.forEach(function(el) {
            el.classList.add('hidden');
        });
        
        if (guestMessage) guestMessage.classList.add('hidden');
        
        if (programMenu) {
            programMenu.style.opacity = '1';
            programMenu.style.pointerEvents = 'auto';
            if (loginBadge) loginBadge.classList.add('hidden');
        }
        
        programCards.forEach(function(card) {
            card.style.cursor = 'pointer';
            card.style.opacity = '1';
        });
        
        // Enable card buttons
        cardBtns.forEach(function(btn) {
            btn.style.pointerEvents = 'auto';
        });
        
        showToast('Selamat datang, ' + session.name + '! 👋');
        
    } else {
        // ===== NOT LOGGED IN =====
        btnLogin.classList.remove('logged-in');
        loginIcon.textContent = 'account_circle';
        btnLogin.title = 'Login';
        
        profileText.textContent = 'Profile';
        
        // Reset welcome title
        if (welcomeTitle) {
            welcomeTitle.innerHTML = 
                'SELAMAT DATANG DI <span class="highlight-maha">Maha</span><span class="highlight-mate">Mate</span>';
        }
        
        // Reset slogan
        if (welcomeSlogan) {
            welcomeSlogan.innerHTML = 'Membantu Kamu <span>memanage</span> Keuangan, Tugas, Dan Kegiatan';
        }
        
        programLock.forEach(function(el) {
            el.classList.remove('hidden');
        });
        
        if (guestMessage) guestMessage.classList.remove('hidden');
        
        if (programMenu) {
            programMenu.style.opacity = '0.5';
            programMenu.style.pointerEvents = 'none';
            if (loginBadge) loginBadge.classList.remove('hidden');
        }
        
        programCards.forEach(function(card) {
            card.style.cursor = 'default';
            card.style.opacity = '0.7';
        });
        
        // Disable card buttons
        cardBtns.forEach(function(btn) {
            btn.style.pointerEvents = 'none';
        });
    }
}

// ===== 5d. Login Popup =====

var loginOverlay = document.getElementById('loginOverlay');
var loginClose = document.getElementById('loginClose');
var loginForm = document.getElementById('loginForm');
var loginUsername = document.getElementById('loginUsername');
var loginPassword = document.getElementById('loginPassword');
var loginError = document.getElementById('loginError');
var loginErrorText = document.getElementById('loginErrorText');

function openLoginPopup() {
    loginOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    loginError.classList.add('hidden');
    loginUsername.value = '';
    loginPassword.value = '';
    setTimeout(function() { loginUsername.focus(); }, 100);
}

function closeLoginPopup() {
    loginOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('btnLoginIcon').addEventListener('click', function() {
    if (isLoggedIn()) {
        // SEMENTARA DINONAKTIFKAN - Nanti buat halaman Profile
        showToast('👤 Halaman Profile sedang dalam pengembangan');
        // openLogoutPopup();  // ← DIKOMENTAR DULU
    } else {
        openLoginPopup();
    }
});

loginClose.addEventListener('click', closeLoginPopup);
loginOverlay.addEventListener('click', function(e) {
    if (e.target === loginOverlay) {
        closeLoginPopup();
    }
});

// ===== 5e. Login Submit =====

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    var username = loginUsername.value.trim();
    var password = loginPassword.value.trim();
    
    if (!username || !password) {
        loginErrorText.textContent = 'Username dan password harus diisi!';
        loginError.classList.remove('hidden');
        return;
    }
    
    var result = loginUser(username, password);
    
    if (result.success) {
        loginError.classList.add('hidden');
        closeLoginPopup();
        updateUIForLogin();
        showToast('Login berhasil! Selamat datang, ' + result.user.name + '! 🎉');
    } else {
        loginErrorText.textContent = result.message;
        loginError.classList.remove('hidden');
        loginPassword.value = '';
        loginPassword.focus();
    }
});

loginPassword.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// ===== 5f. Register =====

var isRegisterMode = false;

document.getElementById('registerLink').addEventListener('click', function(e) {
    e.preventDefault();
    toggleRegisterMode();
});

function toggleRegisterMode() {
    var title = document.querySelector('.login-title');
    var subtitle = document.querySelector('.login-subtitle');
    var forgotLink = document.querySelector('.forgot-link');
    var registerLink = document.querySelector('.register-link');
    var submitBtn = document.getElementById('btnLoginSubmit');
    var nameField = document.getElementById('registerNameField');
    
    isRegisterMode = !isRegisterMode;
    
    if (isRegisterMode) {
        title.textContent = '📝 Registrasi Akun';
        subtitle.textContent = 'Buat akun MahaMate baru';
        forgotLink.style.display = 'none';
        registerLink.innerHTML = 'Sudah punya akun? <a href="#" id="switchToLogin">Login</a>';
        submitBtn.innerHTML = '<span class="material-symbols-rounded">person_add</span> Daftar';
        submitBtn.dataset.mode = 'register';
        
        // Add name field
        var nameDiv = document.createElement('div');
        nameDiv.className = 'form-group';
        nameDiv.id = 'registerNameField';
        nameDiv.innerHTML = `
            <label>Nama Lengkap</label>
            <input type="text" id="registerName" placeholder="Masukkan nama lengkap">
        `;
        loginForm.insertBefore(nameDiv, loginUsername.parentElement);
        
        document.getElementById('switchToLogin').addEventListener('click', function(e) {
            e.preventDefault();
            toggleRegisterMode();
        });
        
    } else {
        title.textContent = '🔐 User Login';
        subtitle.textContent = 'Masuk ke akun MahaMate Anda';
        forgotLink.style.display = '';
        registerLink.innerHTML = 'Belum punya akun? <a href="#" id="registerLink">Daftar</a>';
        submitBtn.innerHTML = '<span class="material-symbols-rounded">login</span> Login';
        submitBtn.dataset.mode = 'login';
        
        var nameFieldEl = document.getElementById('registerNameField');
        if (nameFieldEl) nameFieldEl.remove();
        
        document.getElementById('registerLink').addEventListener('click', function(e) {
            e.preventDefault();
            toggleRegisterMode();
        });
    }
}

// Register submit
document.getElementById('btnLoginSubmit').addEventListener('click', function(e) {
    if (this.dataset.mode === 'register') {
        e.preventDefault();
        registerUserFromPopup();
    }
});

function registerUserFromPopup() {
    var nameField = document.getElementById('registerName');
    var username = loginUsername.value.trim();
    var password = loginPassword.value.trim();
    var name = nameField ? nameField.value.trim() : username;
    
    if (!username || !password) {
        loginErrorText.textContent = 'Username dan password harus diisi!';
        loginError.classList.remove('hidden');
        return;
    }
    
    if (password.length < 4) {
        loginErrorText.textContent = 'Password minimal 4 karakter!';
        loginError.classList.remove('hidden');
        return;
    }
    
    var result = registerUser(username, password, name);
    
    if (result.success) {
        loginError.classList.add('hidden');
        showToast(result.message);
        if (isRegisterMode) toggleRegisterMode();
        loginUsername.value = username;
        loginPassword.value = '';
    } else {
        loginErrorText.textContent = result.message;
        loginError.classList.remove('hidden');
    }
}

// ============================================================
// LOGOUT POPUP (CUSTOM)
// ============================================================

var logoutOverlay = document.getElementById('logoutOverlay');
var logoutCancel = document.getElementById('logoutCancel');
var logoutConfirm = document.getElementById('logoutConfirm');

function openLogoutPopup() {
    logoutOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLogoutPopup() {
    logoutOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Event untuk tombol Logout di sidebar
document.getElementById('btnLogout').addEventListener('click', function(e) {
    e.preventDefault();
    openLogoutPopup();  // Ganti dari confirm() langsung
});

// Tombol Batal
logoutCancel.addEventListener('click', closeLogoutPopup);

// Tombol Ya, Logout
logoutConfirm.addEventListener('click', function() {
    closeLogoutPopup();
    logoutUser();  // Panggil fungsi logout yang sudah ada
});

// Klik overlay untuk tutup
logoutOverlay.addEventListener('click', function(e) {
    if (e.target === logoutOverlay) {
        closeLogoutPopup();
    }
});

// ESC untuk tutup popup
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLogoutPopup();
    }
});

// ===== 5h. Guest Login Link =====

document.getElementById('guestLoginLink').addEventListener('click', function(e) {
    e.preventDefault();
    openLoginPopup();
});

// ===== 5i. Forgot Password =====

document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    showToast('⚠️ Hubungi admin untuk reset password');
});

// ============================================================
// 6. NAVIGASI
// ============================================================

function navigateTo(page) {
    var programPages = ['keuangan', 'tugas', 'kegiatan'];
    
    // Cek login untuk akses program
    if (programPages.indexOf(page) !== -1 && !isLoggedIn()) {
        showToast('🔒 Silakan login terlebih dahulu untuk mengakses program!');
        openLoginPopup();
        return;
    }

    // ============================================================
// SIDEBAR PROGRAM LINKS
// ============================================================

// Ambil semua link di sidebar yang memiliki data-page
document.querySelectorAll('.sidebar-menu .dropdown-link[data-page]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var page = this.dataset.page;
        if (page) {
            navigateTo(page);
        }
    });
});
    
    console.log('📱 Navigasi ke:', page);
    
    // Update active link di sidebar
    document.querySelectorAll('.sidebar-link[data-page]').forEach(function(link) {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    var pageNames = {
        'dashboard': 'Dashboard',
        'keuangan': 'Keuangan',
        'tugas': 'Tugas',
        'kegiatan': 'Kegiatan'
    };
    
    var name = pageNames[page] || page;
    
    // Redirect ke halaman program jika sudah login
    if (programPages.indexOf(page) !== -1 && isLoggedIn()) {
        showToast('📋 Membuka halaman: ' + name);
        window.location.href = '../program/' + page + '/' + page + '.html';
        return;
    }
    
    showToast('📋 Membuka halaman: ' + name);
    closeSidebar();
}

// ===== Event Listener untuk semua link dengan data-page =====
document.querySelectorAll('[data-page]').forEach(function(element) {
    element.addEventListener('click', function(e) {
        // Jika ini link (a) atau button
        if (this.tagName === 'A' || this.tagName === 'BUTTON') {
            e.preventDefault();
        }
        var page = this.dataset.page;
        if (page) {
            navigateTo(page);
        }
    });
});

// ===== Sidebar Links =====
document.querySelectorAll('.sidebar-link[data-page]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var page = this.dataset.page;
        if (page) navigateTo(page);
    });
});

// ============================================================
// 7. NOTIFIKASI
// ============================================================

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
// 8. INITIALIZATION
// ============================================================

// Update UI berdasarkan status login
updateUIForLogin();

console.log('🚀 MahaMate Dashboard siap digunakan!');
console.log('📌 Default user: admin / admin123');
console.log('📌 Guest user: user / user123');
console.log('🔒 Status login:', isLoggedIn() ? '✅ Logged in' : '❌ Guest');