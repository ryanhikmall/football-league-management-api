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

// ==========================================================================
// RENDER FUNCTIONS
// ==========================================================================

async function initDashboard() {
    // Simulasi loading network
    await new Promise(r => setTimeout(r, 600));

    renderStandings();
    renderMatches();
    
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

// Start
document.addEventListener('DOMContentLoaded', initDashboard);

// Observer untuk scroll animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));