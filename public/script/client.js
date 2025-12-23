// ==========================================================================
// MOCK DATA (Simulasi dari Database API)
// ==========================================================================

let standingsData = [
    // SCENARIO: Poin Garuda & Rajawali sangat mepet.
    // Asumsi: Garuda (30) sedang menang, Rajawali (29) sedang kalah.
    // Jika Rajawali menyamakan kedudukan, Garuda turun poin, Rajawali naik poin -> SWAP POSISI!
    { rank: 1, team: { name: 'Garuda FC', code: 'GAR' }, played: 12, won: 9, drawn: 2, lost: 1, gd: 18, points: 30 }, 
    { rank: 2, team: { name: 'Rajawali Utd', code: 'RAJ' }, played: 12, won: 8, drawn: 3, lost: 1, gd: 12, points: 29 },
    { rank: 3, team: { name: 'Bintang Timur', code: 'BIN' }, played: 12, won: 6, drawn: 4, lost: 2, gd: 5, points: 22 },
    { rank: 4, team: { name: 'Persija KW', code: 'PJA' }, played: 12, won: 5, drawn: 3, lost: 4, gd: 2, points: 18 },
    { rank: 5, team: { name: 'Persib KW', code: 'PSB' }, played: 12, won: 4, drawn: 2, lost: 6, gd: -4, points: 14 },
    { rank: 6, team: { name: 'Arema KW', code: 'ARE' }, played: 12, won: 2, drawn: 1, lost: 9, gd: -15, points: 7 },
];

let matchesData = [
    // Live Match: Garuda vs Rajawali
    { id: 1, home: 'Garuda FC', away: 'Rajawali Utd', time: 75, status: 'Live', home_score: 2, away_score: 1 },
    { id: 2, home: 'Bintang Timur', away: 'Persija KW', time: '19:00', status: 'Scheduled', score: 'vs' },
    { id: 3, home: 'Persib KW', away: 'Arema KW', time: 'Tomorrow', status: 'Scheduled', score: 'vs' },
];

let playersData = [
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
    { id: 9, name: "Ramadhan Sananta", pos: "FW", number: 99, team: "RAJ", apps: 9, goals: 9 }, // Top Scorer contender

    // BINTANG TIMUR (Tambahan agar Top Scorer rame)
    { id: 10, name: "Syahrul Trisna", pos: "GK", number: 26, team: "BIN", apps: 10, goals: 0 },
    { id: 11, name: "Ricky Kambuaya", pos: "MF", number: 15, team: "BIN", apps: 12, goals: 3 },
    { id: 12, name: "Dimas Drajad", pos: "FW", number: 9, team: "BIN", apps: 11, goals: 6 },
    { id: 13, name: "Renan Silva", pos: "MF", number: 10, team: "BIN", apps: 12, goals: 4 },

    // Dummy Players for other teams
    { id: 14, name: "David da Silva KW", pos: "FW", number: 19, team: "PSB", apps: 12, goals: 7 },
    { id: 15, name: "Riko Simanjuntak KW", pos: "MF", number: 25, team: "PJA", apps: 11, goals: 2 },
    { id: 16, name: "Marko Simic KW", pos: "FW", number: 9, team: "PJA", apps: 10, goals: 5 },
];

// ==========================================================================
// RENDER FUNCTIONS
// ==========================================================================

async function initDashboard() {
    await new Promise(r => setTimeout(r, 600)); // Simulate Loading

    renderStandings(); // Initial render
    renderMatches();
    renderTopScorers();
    initTeamSelector();
    
    document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('visible'));

    startLiveSimulation();
}

// UPDATE: Render Standings dengan Logic Highlight & FLIP Support
function renderStandings() {
    const tbody = document.getElementById('standings-body');
    
    // 1. Sort logic (Points -> GD)
    const sortedData = [...standingsData].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.gd - a.gd;
    });

    // Update Rank Number in Data
    sortedData.forEach((team, index) => team.rank = index + 1);
    
    // 2. Build HTML
    const html = sortedData.map(row => {
        const rankClass = row.rank <= 3 ? 'rank-top' : '';
        const gdColor = row.gd > 0 ? '#10b981' : (row.gd < 0 ? '#ef4444' : '#8e8ea0');
        const gdPrefix = row.gd > 0 ? '+' : '';

        // --- Logic Highlight Live Match ---
        let rowClass = '';
        let statusBadge = '';

        // Cari apakah tim ini sedang main di match 'Live'
        const liveMatch = matchesData.find(m => 
            m.status === 'Live' && (m.home === row.team.name || m.away === row.team.name)
        );

        if (liveMatch) {
            const isHome = liveMatch.home === row.team.name;
            const myScore = isHome ? liveMatch.home_score : liveMatch.away_score;
            const oppScore = isHome ? liveMatch.away_score : liveMatch.home_score;

            if (myScore > oppScore) {
                rowClass = 'live-row-winning'; // Lagi Menang
                statusBadge = '<span style="font-size:0.6rem; margin-top:4px; display:inline-block; color:var(--color-success); letter-spacing:0.05em;">● WINNING</span>';
            } else if (myScore < oppScore) {
                rowClass = 'live-row-losing'; // Lagi Kalah
            } else {
                rowClass = 'live-row'; // Seri
            }
        }
        // ----------------------------------

        return `
            <tr class="${rowClass}" data-team-code="${row.team.code}">
                <td class="rank-cell ${rankClass}">${row.rank}</td>
                <td>
                    <div class="team-flex">
                        <div class="team-logo">${row.team.code}</div>
                        <div style="display:flex; flex-direction:column; line-height:1.1; justify-content:center;">
                            <span>${row.team.name}</span>
                            ${statusBadge}
                        </div>
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
        const isFinished = m.status === 'Finished';
        
        // Display logic
        let timeDisplay = m.time;
        // Default score 'vs'
        let scoreDisplay = m.score || 'vs';

        // FIX: Tampilkan skor jika Live ATAU sudah Finished
        if(isLive || isFinished) {
            scoreDisplay = `${m.home_score} - ${m.away_score}`;
        }

        if(isLive) {
            // Animasi 'kedap kedip'
            timeDisplay = `<span class="live-dot" style="width:6px; height:6px; background:var(--color-danger); display:inline-block; border-radius:50%; margin-right:4px;"></span> ${m.time}'`;
        } else if (isFinished) {
            timeDisplay = `FT`;
        }

        const scoreClass = isLive ? 'score-live' : '';
        const timeClass = isLive ? 'match-live' : '';

        return `
            <div class="match-item" id="match-${m.id}">
                <div class="match-meta">
                    <span>Liga 1</span>
                    <span class="match-time ${timeClass}">
                        ${timeDisplay}
                    </span>
                </div>
                <div class="match-teams">
                    <span class="team-name">${m.home}</span>
                    <div class="match-score ${scoreClass}">
                        ${scoreDisplay}
                    </div>
                    <span class="team-name team-away">${m.away}</span>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// UPDATE: Render Top Scorers dengan opsi highlight
function renderTopScorers(highlightPlayerId = null) {
    const tbody = document.getElementById('top-scorers-body');
    
    // 1. Ambil semua data player, sort berdasarkan goals descending
    const sortedPlayers = [...playersData].sort((a, b) => b.goals - a.goals).slice(0, 5); // Ambil Top 5

    const html = sortedPlayers.map((p, index) => {
        // Style badge posisi
        let badgeClass = 'pos-MF'; 
        if (p.pos === 'FW') badgeClass = 'pos-FW';
        
        // Cek apakah player ini yang baru cetak gol
        const rowClass = (highlightPlayerId && p.id === highlightPlayerId) ? 'flash-update' : '';

        return `
            <tr class="${rowClass}">
                <td class="rank-cell" style="width:30px; font-size:0.8rem;">${index + 1}</td>
                <td>
                    <div style="display:flex; flex-direction:column; line-height:1.2;">
                        <span style="font-weight:600; font-size:0.9rem;">${p.name}</span>
                        <span style="font-size:0.75rem; color:var(--color-text-muted);">${p.team}</span>
                    </div>
                </td>
                <td class="stat-cell" style="color:white; font-weight:700; font-size:1rem;">${p.goals}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;

    // Hapus class flash setelah animasi selesai supaya bisa di-trigger lagi nanti
    if(highlightPlayerId) {
        setTimeout(() => {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(r => r.classList.remove('flash-update'));
        }, 1000);
    }
}

// ==========================================================================
// LIVE SIMULATION LOGIC (Updated with Animation)
// ==========================================================================
function startLiveSimulation() {
    const liveMatchIndex = 0; 
    
    setInterval(() => {
        const match = matchesData[liveMatchIndex];
        
        // 1. Increment Time
        if (typeof match.time === 'number' && match.time < 90) {
            match.time++;
            
            // Chance to score goal
            // Probabilitas 20% setiap tick
            if (Math.random() > 0.80) { 
                simulateGoalWithAnimation(liveMatchIndex);
            }
            
            renderMatches(); 
        } else if (match.time >= 90 && match.status !== 'Finished') {
            match.time = "FT";
            match.status = "Finished";
            renderMatches(); // Render ulang untuk menampilkan skor akhir dan status FT
            renderStandings(); // Update klasemen akhir (hilangkan highlight live)
        }

    }, 2000); 
}

// Helper: Hitung poin berdasarkan skor saat ini
function getPointsFromScore(myScore, oppScore) {
    if (myScore > oppScore) return 3;
    if (myScore === oppScore) return 1;
    return 0;
}

// UPDATE: Fungsi Goal dengan FLIP Animation & Top Scorer Update
function simulateGoalWithAnimation(matchIndex) {
    const match = matchesData[matchIndex];
    const tbody = document.getElementById('standings-body');

    // --- STEP 1: Capture Old Positions (First) ---
    const oldPositions = new Map();
    const rows = Array.from(tbody.children);
    rows.forEach(row => {
        const code = row.getAttribute('data-team-code');
        if (code) oldPositions.set(code, row.getBoundingClientRect().top);
    });

    // --- STEP 2: Update Data ---
    
    // BIAS LOGIC: Supaya Rajawali (Away) lebih sering comeback untuk demo animasi swap
    // Jika Home sedang menang, probabilitas Away nge-gol diperbesar (70%)
    let chanceAwayScores = 0.5;
    if (match.home_score > match.away_score) {
        chanceAwayScores = 0.7; // Rajawali ngegas
    }

    const scorerIsHome = Math.random() > chanceAwayScores;
    
    let scorerTeamCode = scorerIsHome ? 'GAR' : 'RAJ'; 
    let teamName = scorerIsHome ? match.home : match.away;
    
    // Simpan poin SEBELUM update skor
    const preHomePoints = getPointsFromScore(match.home_score, match.away_score);
    const preAwayPoints = getPointsFromScore(match.away_score, match.home_score);

    // Update Score
    if (scorerIsHome) match.home_score++;
    else match.away_score++;

    // Hitung poin SETELAH update skor
    const postHomePoints = getPointsFromScore(match.home_score, match.away_score);
    const postAwayPoints = getPointsFromScore(match.away_score, match.home_score);

    // Update Player Goal
    let scorerId = null;
    const possibleScorers = playersData.filter(p => p.team === scorerTeamCode && p.pos !== 'GK');
    if (possibleScorers.length > 0) {
        const randomPlayer = possibleScorers[Math.floor(Math.random() * possibleScorers.length)];
        randomPlayer.goals++;
        scorerId = randomPlayer.id; // Simpan ID pencetak gol
    }
    
    // Render Top Scorers dengan efek highlight
    renderTopScorers(scorerId);

    // Update Standings Points & GD secara Real-time
    const homeStats = standingsData.find(t => t.team.name === match.home);
    const awayStats = standingsData.find(t => t.team.name === match.away);

    // Update GD
    homeStats.gd += (scorerIsHome ? 1 : -1);
    awayStats.gd += (scorerIsHome ? -1 : 1);

    // Update Points (Delta dari kondisi sebelumnya)
    homeStats.points += (postHomePoints - preHomePoints);
    awayStats.points += (postAwayPoints - preAwayPoints);

    // --- STEP 3: Re-Render (Last) ---
    renderStandings();

    // --- STEP 4: Calculate Delta & Animate (Invert & Play) ---
    const newRows = Array.from(tbody.children);
    
    newRows.forEach(row => {
        const code = row.getAttribute('data-team-code');
        const oldTop = oldPositions.get(code);
        
        // Cek jika ini tim yang nge-gol, kasih flash effect
        const teamInfo = standingsData.find(t => t.team.code === code);
        if(teamInfo && teamInfo.team.name === teamName) {
            row.classList.add('flash-update');
            setTimeout(() => row.classList.remove('flash-update'), 1000);
        }

        if (oldTop !== undefined) {
            const newTop = row.getBoundingClientRect().top;
            const delta = oldTop - newTop;

            if (delta !== 0) {
                // INVERT: Pindahkan visual kembali ke posisi lama tanpa animasi
                row.style.transform = `translateY(${delta}px)`;
                row.style.transition = 'none';

                // PLAY: Paksa browser paint, lalu enable transisi ke 0 (posisi baru)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        row.style.transition = 'transform 0.6s cubic-bezier(0.2, 0, 0, 1)';
                        row.style.transform = '';
                    });
                });
            }
        }
    });
}


// ==========================================================================
// CUSTOM DROPDOWN LOGIC
// ==========================================================================
function initTeamSelector() {
    const dropdown = document.getElementById('team-dropdown');
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const display = document.getElementById('selected-team-display');
    const menu = dropdown.querySelector('.dropdown-menu');

    // Populate Dropdown
    const uniqueTeams = [...new Set(playersData.map(p => p.team))];
    
    const html = uniqueTeams.map(code => {
        const teamInfo = standingsData.find(s => s.team.code === code);
        const teamName = teamInfo ? teamInfo.team.name : code;
        
        return `
        <div class="dropdown-item" data-value="${code}">
            <div class="team-logo small">${code}</div>
            ${teamName}
        </div>
        `;
    }).join('');
    
    menu.innerHTML = html;

    // Set Default (First Team)
    const defaultCode = uniqueTeams[0];
    const defaultInfo = standingsData.find(s => s.team.code === defaultCode);
    updateTriggerDisplay(defaultInfo ? defaultInfo.team.name : defaultCode, defaultCode);
    renderPlayers(defaultCode);
    if(menu.firstElementChild) menu.firstElementChild.classList.add('selected');

    // Toggle Logic
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    // Item Selection Logic
    menu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const code = item.dataset.value;
            const name = item.textContent.trim().split(/\s+/).slice(1).join(' ');

            menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            
            updateTriggerDisplay(name, code);
            renderPlayers(code);
            dropdown.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

function updateTriggerDisplay(name, code) {
    const display = document.getElementById('selected-team-display');
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
        let badgeClass = 'pos-MF';
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

    tbody.style.opacity = '0';
    setTimeout(() => {
        tbody.innerHTML = html;
        tbody.style.opacity = '1';
    }, 150);
}

document.addEventListener('DOMContentLoaded', initDashboard);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));