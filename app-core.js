/**
 * app-core.js
 * Menyeragamkan Logo SVG Skill Link, Header, Sidebar Drawer, Toast, dan Data Lintas Halaman.
 */
(function () {
    const PROFILE_KEY = "skillLinkProfile";
    const PHOTO_KEY = "skillLinkProfilePhoto";

    // Logo resmi Skill Link (SVG konsisten di header & sidebar)
    const SKILL_LINK_LOGO_SVG = `
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 14.5C13.5 11.5 17.5 10.5 21 12L24.5 13.5" stroke="#0b7fd0" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M24.5 21.5C22.5 24.5 18.5 25.5 15 24L11.5 22.5" stroke="#0b7fd0" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M13 18L17.5 21.5L23.5 15.5" stroke="#0b7fd0" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9.5" cy="14" r="2" fill="#0b7fd0"/>
            <circle cx="26.5" cy="22" r="2" fill="#0b7fd0"/>
        </svg>
    `;

    const MENU_ITEMS = [
        { href: "dashboard.html", icon: "fa-solid fa-border-all", label: "Dashboard" },
        { href: "profil.html", icon: "fa-regular fa-user", label: "Profil Saya" },
        { href: "cari-tim.html", icon: "fa-solid fa-user-group", label: "Cari Tim" },
        { href: "filter-rekrutmen.html", icon: "fa-solid fa-filter", label: "Filter Rekrutmen" },
        { href: "kelola-tim.html", icon: "fa-solid fa-users", label: "Kelola Tim" },
        { href: "portofolio.html", icon: "fa-solid fa-briefcase", label: "Susunan Portofolio" },
        { href: "#chat", icon: "fa-regular fa-comment", label: "Chat/Inbox", dev: true },
        { href: "kelola-lomba.html", icon: "fa-solid fa-trophy", label: "Kelola Pusat Informasi Lomba" },
        { href: "validasi-sertifikat.html", icon: "fa-solid fa-certificate", label: "Validasi Nilai & Sertifikat" }
    ];

    function getCurrentPage() {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf("/") + 1);
        return file || "dashboard.html";
    }

    window.showToast = function (message, type = "success") {
        let toast = document.getElementById("globalToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "globalToast";
            toast.className = "global-toast";
            document.body.appendChild(toast);
        }
        const iconClass = type === "error" ? "fa-circle-exclamation" : type === "info" ? "fa-circle-info" : "fa-circle-check";
        toast.className = "global-toast " + (type !== "success" ? type : "");
        toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
        toast.style.display = "flex";

        clearTimeout(window.__toastTimer);
        window.__toastTimer = setTimeout(() => {
            toast.style.display = "none";
        }, 3000);
    };

    function renderShell() {
        const currentPage = getCurrentPage();
        const shellHost = document.getElementById("appShell");
        if (!shellHost) return;

        const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
        const savedPhoto = localStorage.getItem(PHOTO_KEY);

        const userName = (savedProfile && savedProfile.name) ? savedProfile.name : "Dzaky";
        const userSub = (savedProfile && savedProfile.studyProgram && savedProfile.year)
            ? `${savedProfile.studyProgram} - Angkatan ${savedProfile.year}`
            : "TRPL - Angkatan 2025";

        const avatarInner = savedPhoto
            ? `<img src="${savedPhoto}" alt="Avatar">`
            : `<i class="fa-regular fa-user"></i>`;

        const navHtml = MENU_ITEMS.map(item => {
            const activeClass = !item.dev && currentPage.toLowerCase() === item.href.toLowerCase() ? "active" : "";
            return `
                <li>
                    <a href="${item.href}" class="${activeClass}" ${item.dev ? 'data-dev="true"' : ""}>
                        <i class="${item.icon}"></i>
                        <span>${item.label}</span>
                    </a>
                </li>
            `;
        }).join("");

        shellHost.innerHTML = `
            <div id="sidebarBackdrop" class="sidebar-backdrop"></div>
            <aside id="sidebarDrawer" class="sidebar-drawer">
                <div class="drawer-header">
                    <div class="drawer-brand">
                        <div class="brand-box">${SKILL_LINK_LOGO_SVG}</div>
                        <span>Skill Link</span>
                    </div>
                    <button id="closeDrawerBtn" class="menu-toggle" title="Tutup Menu">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
                <ul class="drawer-menu">${navHtml}</ul>
            </aside>

            <header class="header">
                <div class="header-left">
                    <div class="brand-box">${SKILL_LINK_LOGO_SVG}</div>
                    <button id="openDrawerBtn" class="menu-toggle" title="Buka Menu">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <span class="brand-title">Skill Link</span>
                </div>

                <div class="header-search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="globalHeaderSearch" placeholder="Cari lomba, tim, atau skill...">
                </div>

                <div class="header-right">
                    <button type="button" class="notif-btn" id="globalNotifBtn" title="Notifikasi">
                        <i class="fa-regular fa-bell"></i>
                        <span class="notif-dot"></span>
                    </button>

                    <div class="user-profile" onclick="location.href='profil.html'" title="Ke Profil Saya">
                        <div class="user-avatar" id="headerAvatar">${avatarInner}</div>
                        <div class="user-meta">
                            <strong id="headerName">${userName}</strong>
                            <small id="headerSubtitle">${userSub}</small>
                        </div>
                    </div>
                </div>
            </header>
        `;

        const drawer = document.getElementById("sidebarDrawer");
        const backdrop = document.getElementById("sidebarBackdrop");
        const toggleDrawer = (open) => {
            drawer.classList.toggle("open", open);
            backdrop.style.display = open ? "block" : "none";
        };

        document.getElementById("openDrawerBtn").addEventListener("click", () => toggleDrawer(true));
        document.getElementById("closeDrawerBtn").addEventListener("click", () => toggleDrawer(false));
        backdrop.addEventListener("click", () => toggleDrawer(false));

        document.getElementById("globalNotifBtn").addEventListener("click", () => {
            window.showToast("Tidak ada notifikasi baru yang belum dibaca.", "info");
        });

        shellHost.querySelectorAll('a[data-dev="true"]').forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                toggleDrawer(false);
                window.showToast("Fitur Chat/Inbox masih dalam tahap pengembangan.", "info");
            });
        });

        // Global search lintas halaman
        const searchInput = document.getElementById("globalHeaderSearch");
        const params = new URLSearchParams(window.location.search);
        if (params.get("q")) {
            searchInput.value = params.get("q");
        }

        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const q = searchInput.value.trim();
                if (!q) return;
                if (currentPage === "cari-tim.html" || currentPage === "kelola-lomba.html") {
                    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
                    return;
                }
                const isLomba = /lomba|gemastik|hackathon|kompetisi|ui\/ux/i.test(q);
                window.location.href = `${isLomba ? "kelola-lomba.html" : "cari-tim.html"}?q=${encodeURIComponent(q)}`;
            }
        });
    }

    document.addEventListener("DOMContentLoaded", renderShell);
})();
