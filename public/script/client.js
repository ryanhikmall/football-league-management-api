// ==========================================================================
// MOCK DATA (Simulasi dari Database API)
// ==========================================================================

// NOTE: Logos now use 3-letter codes for minimalist design
const standingsData = [
    { rank: 1, team: { name: 'Garuda FC', code: 'GAR' }, played: 12, won: 9, drawn: 2, lost: 1, gd: 18, points: 29 },
    { rank: 2, team: { name: 'Rajawali Utd', code: 'RAJ' }, played: 12, won: 8, drawn: 3, lost: 1, gd: 12, points: 27 },
    { rank: 3, team: { name: 'Bintang Timur', code: 'BIN' }, played: 12, won: 6, drawn: 4, lost: 2, gd: 5, points: 22 },
    { rank: 4, team: { name: 'Persija KW', code: 'PJA' }, played: 12, won: 5, drawn: 3, lost: 4, gd: 2, points: 18 },
    { rank: 5, team: { name: 'Persib KW', code: 'PSB' }, played: 12, won: 4, drawn: 2, lost: 6, gd: -4, points: 14 },
    { rank: 6, team: { name: 'Arema KW', code: 'ARE' }, played: 12, won: 2, drawn: 1, lost: 9, gd: -15, points: 7 },
];

const matchesData = [
    { home: 'Garuda FC', away: 'Rajawali Utd', time: '75\'', status: 'Live', score: '2 - 1' },
    { home: 'Bintang Timur', away: 'Persija KW', time: '19:00', status: 'Scheduled', score: 'vs' },
    { home: 'Persib KW', away: 'Arema KW', time: 'Tomorrow', status: 'Scheduled', score: 'vs' },
];

// NEW: Players Data Mockup
const playersData = [
    // GARUDA FC
    { id: 1, name: "Nadeo Winata", pos: "GK", number: 1, team: "GAR", apps: 12, goals: 0 },
    { id: 2, name: "Elkan Baggott", pos: "DF", number: 4, team: "GAR", apps: 11, goals: 2 },
    { id: 3, name: "Marselino Ferdinan", pos: "MF", number: 10, team: "GAR", apps: 12, goals: 5 },
    { id: 4, name: "Rafael Struick", pos: "FW", number: 9, team: "GAR", apps: 10, goals: 8 },
    { id: 5, name: "Asnawi Mangkualam", pos: "DF", number: 14, team: "GAR", apps: 12, goals: 1 },
    
    // RAJAWALI UTD
    { id: 6, name: "Ernando Ari", pos: "GK", number: 21, team: "RAJ", apps: 12, goals: 0 },
    { id: 7, name: "Rizky Ridho", pos: "DF", number: 5, team: "RAJ", apps: 12, goals: 1 },
    { id: 8, name: "Ivar Jenner", pos: "MF", number: 6, team: "RAJ", apps: 11, goals: 2 },
    { id: 9, name: "Ramadhan Sananta", pos: "FW", number: 99, team: "RAJ", apps: 9, goals: 7 },

    // BINTANG TIMUR
    { id: 10, name: "Syahrul Trisna", pos: "GK", number: 26, team: "BIN", apps: 10, goals: 0 },
    { id: 11, name: "Ricky Kambuaya", pos: "MF", number: 15, team: "BIN", apps: 12, goals: 3 },
    { id: 12, name: "Dimas Drajad", pos: "FW", number: 9, team: "BIN", apps: 11, goals: 4 },

    // Mock Data Default for others
    { id: 99, name: "Top Scorer Unknown", pos: "FW", number: 10, team: "PJA", apps: 12, goals: 10 },
];

// ==========================================================================
// RENDER FUNCTIONS
// ==========================================================================

async function initDashboard() {
    // Simulasi loading network
    await new Promise(r => setTimeout(r, 600));

    renderStandings();
    renderMatches();
    initTeamSelector(); // Init custom dropdown
    
    // Aktifkan animasi elemen
    document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('visible'));
}

function renderStandings() {
    const tbody = document.getElementById('standings-body');
    
    const html = standingsData.map(row => {
        // Highlight top 3 ranks
        const rankClass = row.rank <= 3 ? 'rank-top' : '';
        const gdColor = row.gd > 0 ? '#10b981' : (row.gd < 0 ? '#ef4444' : '#8e8ea0');
        const gdPrefix = row.gd > 0 ? '+' : '';

        return `
            <tr>
                <td class="rank-cell ${rankClass}">${row.rank}</td>
                <td>
                    <div class="team-flex">
                        <div class="team-logo">${row.team.code}</div>
                        ${row.team.name}
                    </div>
                </td>
                <td class="stat-cell">${row.played}</td>
                <td class="stat-cell">${row.won}</td>
                <td class="stat-cell">${row.drawn}</td>
                <td class="stat-cell">${row.lost}</td>
                <td class="stat-cell" style="color: ${gdColor}; font-weight:600;">
                    ${gdPrefix}${row.gd}
                </td>
                <td class="points-cell">${row.points}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
}

function renderMatches() {
    const container = document.getElementById('matches-list');

    const html = matchesData.map(m => {
        const isLive = m.status === 'Live';
        const timeClass = isLive ? 'match-live' : '';
        const scoreClass = isLive ? 'score-live' : '';

        return `
            <div class="match-item">
                <div class="match-meta">
                    <span>Liga 1</span>
                    <span class="match-time ${timeClass}">
                        ${isLive ? '● ' : ''}${m.time}
                    </span>
                </div>
                <div class="match-teams">
                    <span class="team-name">${m.home}</span>
                    <div class="match-score ${scoreClass}">
                        ${m.score}
                    </div>
                    <span class="team-name team-away">${m.away}</span>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// ==========================================================================
// CUSTOM DROPDOWN LOGIC
// ==========================================================================
function initTeamSelector() {
    const dropdown = document.getElementById('team-dropdown');
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const display = document.getElementById('selected-team-display');
    const menu = dropdown.querySelector('.dropdown-menu');

    // 1. Populate Dropdown Options
    const html = standingsData.map(s => `
        <div class="dropdown-item" data-value="${s.team.code}">
            <div class="team-logo small">${s.team.code}</div>
            ${s.team.name}
        </div>
    `).join('');
    
    menu.innerHTML = html;

    // 2. Set Default Selection (First Team)
    const defaultTeam = standingsData[0];
    updateTriggerDisplay(defaultTeam.team.name, defaultTeam.team.code);
    renderPlayers(defaultTeam.team.code);
    // Mark as selected in menu
    menu.firstElementChild.classList.add('selected');

    // 3. Toggle Logic
    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from closing immediately
        dropdown.classList.toggle('active');
    });

    // 4. Item Selection Logic
    menu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const code = item.dataset.value;
            const name = item.textContent.trim().split(/\s+/).slice(1).join(' '); // Simple parse: remove code

            // Update UI State
            menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            
            // Update Display & Render
            updateTriggerDisplay(item.innerText.replace(code, '').trim(), code);
            renderPlayers(code);
            
            // Close Dropdown
            dropdown.classList.remove('active');
        });
    });

    // 5. Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

// Helper to update the trigger button text nicely
function updateTriggerDisplay(name, code) {
    const display = document.getElementById('selected-team-display');
    // Using HTML to include the mini logo in the trigger
    display.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <div class="team-logo small" style="width:20px; height:20px; font-size:0.55rem;">${code}</div>
            <span>${name}</span>
        </div>
    `;
}

function renderPlayers(teamCode) {
    const tbody = document.getElementById('players-body');
    const filteredPlayers = playersData.filter(p => p.team === teamCode);

    if (filteredPlayers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:#8e8ea0;">No players found for this team.</td></tr>`;
        return;
    }

    const html = filteredPlayers.map(p => {
        // Sort badge color based on position
        let badgeClass = 'pos-MF'; // default
        if (p.pos === 'GK') badgeClass = 'pos-GK';
        if (p.pos === 'DF') badgeClass = 'pos-DF';
        if (p.pos === 'FW') badgeClass = 'pos-FW';

        return `
            <tr>
                <td class="jersey-num">#${p.number}</td>
                <td style="font-weight:600;">${p.name}</td>
                <td><span class="pos-badge ${badgeClass}">${p.pos}</span></td>
                <td class="stat-cell">${p.apps}</td>
                <td class="stat-cell" style="color:white; font-weight:700;">${p.goals}</td>
            </tr>
        `;
    }).join('');

    // Animasi simple saat ganti konten
    tbody.style.opacity = '0';
    setTimeout(() => {
        tbody.innerHTML = html;
        tbody.style.opacity = '1';
    }, 150);
    tbody.style.transition = 'opacity 0.2s';
}

// Start
document.addEventListener('DOMContentLoaded', initDashboard);

// Observer untuk scroll animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));