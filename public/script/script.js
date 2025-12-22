// ==========================================================================
// DATA API LENGKAP
// ==========================================================================

const endpoints = [
    // --- 1. AUTHENTICATION ---
    {
        category: 'Authentication',
        id: 'auth_register',
        method: 'POST',
        path: '/auth/register',
        title: 'Register New User',
        desc: 'Digunakan untuk mendaftarkan user baru (Operator/Admin).',
        status: 201,
        response: {
            "data": {},
            "name": "Budi Operator",
            "email": "budi@league.com",
            "role": "operator",
            "updated_at": "2024-12-23T10:00:00.000000Z",
            "created_at": "2024-12-23T10:00:00.000000Z",
            "id": 1,
            "access_token": "1|laravel_sanctum_token...",
            "token_type": "Bearer"
        },
        error_status: 422,
        error_response: {
            "message": "The email has already been taken.",
            "errors": {
                "email": ["The email has already been taken."]
            }
        },
        params: [
            { key: 'name', req: true, desc: 'Full name' },
            { key: 'email', req: true, desc: 'Valid email address' },
            { key: 'password', req: true, desc: 'Min. 8 characters' },
            { key: 'role', req: true, desc: 'e.g. "operator"' }
        ]
    },
    {
        category: 'Authentication',
        id: 'auth_login',
        method: 'POST',
        path: '/auth/login',
        title: 'Login User',
        desc: 'Menukarkan email & password dengan Token.',
        status: 200,
        response: {
            "message": "Hi Budi Operator, welcome to home",
            "access_token": "2|laravel_sanctum_token...",
            "token_type": "Bearer"
        },
        error_status: 401,
        error_response: { "message": "Unauthorized" },
        params: [
            { key: 'email', req: true, desc: 'Registered email' },
            { key: 'password', req: true, desc: 'Your password' }
        ]
    },
    {
        category: 'Authentication',
        id: 'auth_me',
        method: 'GET',
        path: '/auth/me',
        title: 'Get Current User',
        desc: 'Mengecek user siapa yang sedang login berdasarkan token.',
        status: 200,
        response: {
            "id": 1,
            "name": "Budi Operator",
            "email": "budi@league.com",
            "role": "operator"
        },
        error_status: 401,
        error_response: { "message": "Unauthenticated." },
        params: []
    },
    {
        category: 'Authentication',
        id: 'auth_logout',
        method: 'POST',
        path: '/auth/logout',
        title: 'Logout',
        desc: 'Menghapus sesi token dari server.',
        status: 200,
        response: {
            "message": "You have successfully logged out"
        },
        error_status: 401,
        error_response: { "message": "Unauthenticated." },
        params: []
    },

    // --- 2. TEAMS ---
    {
        category: 'Teams Management',
        id: 'teams_create',
        method: 'POST',
        path: '/teams',
        title: 'Create Team',
        desc: 'Membuat tim baru dalam liga.',
        status: 201,
        response: {
            "success": true,
            "message": "Team created successfully",
            "data": {
                "name": "Bali United",
                "home_base": "Stadion I Wayan Dipta",
                "logo_url": "https://upload.wikimedia.org/bali.png",
                "id": 1
            }
        },
        error_status: 422,
        error_response: { "message": "The name field is required." },
        params: [
            { key: 'name', req: true, desc: 'Team Name' },
            { key: 'home_base', req: true, desc: 'Stadium Name' },
            { key: 'logo_url', req: false, desc: 'Logo Image URL' }
        ]
    },
    {
        category: 'Teams Management',
        id: 'teams_list',
        method: 'GET',
        path: '/teams',
        title: 'List All Teams',
        desc: 'Mengambil daftar semua tim yang terdaftar.',
        status: 200,
        response: {
            "success": true,
            "message": "List of teams",
            "data": [
                { "id": 1, "name": "Bali United", "home_base": "Stadion Dipta" },
                { "id": 2, "name": "Persib Bandung", "home_base": "GBLA" }
            ]
        },
        error_status: 500,
        error_response: { "message": "Server Error" },
        params: []
    },

    // --- 3. PLAYERS ---
    {
        category: 'Players',
        id: 'players_add',
        method: 'POST',
        path: '/players',
        title: 'Add Player',
        desc: 'Menambahkan pemain ke dalam tim.',
        status: 201,
        response: {
            "success": true,
            "message": "Player created successfully",
            "data": {
                "team_id": 1,
                "name": "Ilija Spasojevic",
                "position": "FW",
                "jersey_number": 9,
                "id": 1
            }
        },
        error_status: 422,
        error_response: { "message": "Invalid Position" },
        params: [
            { key: 'team_id', req: true, desc: 'Team ID' },
            { key: 'name', req: true, desc: 'Player Name' },
            { key: 'position', req: true, desc: 'GK/DF/MF/FW' },
            { key: 'jersey_number', req: true, desc: 'Jersey No.' }
        ]
    },
    {
        category: 'Players',
        id: 'players_get',
        method: 'GET',
        path: '/players',
        title: 'Get Players',
        desc: 'Mengambil daftar pemain, bisa difilter per tim.',
        status: 200,
        response: {
            "success": true,
            "message": "List of players",
            "data": [
                {
                    "id": 1,
                    "team_id": 1,
                    "name": "Ilija Spasojevic",
                    "position": "FW",
                    "team": { "id": 1, "name": "Bali United" }
                }
            ]
        },
        error_status: 404,
        error_response: { "message": "Team not found" },
        params: [
            { key: 'team_id', req: false, desc: 'Filter by Team ID' }
        ]
    },

    // --- 4. MATCHES ---
    {
        category: 'Matches & Standings',
        id: 'matches_create',
        method: 'POST',
        path: '/matches',
        title: 'Create Match',
        desc: 'Membuat jadwal pertandingan baru (Default 0-0).',
        status: 201,
        response: {
            "success": true,
            "message": "Match created successfully",
            "data": {
                "home_team_id": 1,
                "away_team_id": 2,
                "match_date": "2024-12-30 19:30:00",
                "home_score": 0,
                "away_score": 0,
                "status": "scheduled",
                "id": 10
            }
        },
        error_status: 422,
        error_response: {
            "message": "The home team id and away team id must be different."
        },
        params: [
            { key: 'home_team_id', req: true, desc: 'Home Team ID' },
            { key: 'away_team_id', req: true, desc: 'Away Team ID' },
            { key: 'match_date', req: true, desc: 'Y-m-d H:i:s' }
        ]
    },
    {
        category: 'Matches & Standings',
        id: 'matches_update',
        method: 'PUT',
        path: '/matches/{id}',
        title: 'Update Score',
        desc: 'Mengupdate skor dan status pertandingan.',
        status: 200,
        response: {
            "success": true,
            "message": "Match updated successfully",
            "data": {
                "id": 10,
                "home_score": 3,
                "away_score": 1,
                "status": "finished"
            }
        },
        error_status: 404,
        error_response: { "message": "Match not found" },
        params: [
            { key: 'home_score', req: true, desc: 'Home Goals' },
            { key: 'away_score', req: true, desc: 'Away Goals' },
            { key: 'status', req: true, desc: "'finished'" }
        ]
    },
    {
        category: 'Matches & Standings',
        id: 'standings_get',
        method: 'GET',
        path: '/standings',
        title: 'League Standings',
        desc: 'Klasemen otomatis (Points -> GD -> GF).',
        status: 200,
        response: {
            "success": true,
            "message": "Current Standings",
            "data": [
                { "team_name": "Bali United", "points": 3, "gd": 2 },
                { "team_name": "Persib Bandung", "points": 0, "gd": -2 }
            ]
        },
        error_status: 500,
        error_response: { "message": "Server Error" },
        params: []
    }
];

// ==========================================================================
// RENDER & LOGIC
// ==========================================================================
const sidebar = document.getElementById('sidebar-list');
const content = document.getElementById('detail-content');

function renderSidebar() {
    const categories = [...new Set(endpoints.map(item => item.category))];
    let html = '';

    categories.forEach(cat => {
        html += `<div class="sidebar-category-title">${cat}</div>`;
        endpoints.forEach((ep, index) => {
            if (ep.category === cat) {
                html += `
                <div class="sidebar-item" onclick="loadEndpoint(${index}, this)">
                    <span class="sidebar-label">${ep.title}</span>
                    <span class="badge-mini bg-${ep.method}">${ep.method}</span>
                </div>`;
            }
        });
    });

    sidebar.innerHTML = html;
}

// Pretty JSON Highlighting (Fixed Indentation to 2 spaces)
function highlightJSON(json) {
    if (typeof json !== 'string') json = JSON.stringify(json, undefined, 2);
    
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'jv-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'jv-key';
            } else {
                cls = 'jv-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'jv-bool';
        } else if (/null/.test(match)) {
            cls = 'jv-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

window.loadEndpoint = (index, el) => {
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    if (el) el.classList.add('active');

    const data = endpoints[index];
    
    // Method Color
    let methodColor = '#3b82f6';
    if(data.method === 'POST') methodColor = '#10b981';
    if(data.method === 'PUT') methodColor = '#f59e0b';

    let paramHTML = '';
    if (data.params.length > 0) {
        // Updated Table Layout Structure
        paramHTML = `<table class="params-table">
            <thead><tr><th>Parameter</th><th>Description</th></tr></thead>
            <tbody>
                ${data.params.map(p => `
                    <tr>
                        <td>
                            <!-- Flex Container handled by CSS -->
                            <span class="param-key">${p.key}</span>
                            ${p.req ? '<span class="param-req">REQ</span>' : ''}
                        </td>
                        <td>${p.desc}</td>
                    </tr>`).join('')}
            </tbody>
        </table>`;
    } else {
        paramHTML = `<p style="margin-bottom:2rem; color:var(--color-text-muted); font-size:0.85rem; font-style:italic; opacity:0.7;">No parameters required.</p>`;
    }

    content.innerHTML = `
        <div class="fade-in-up visible">
            <div class="detail-header">
                <span class="method-badge" style="background:${methodColor}15; color:${methodColor}; border:1px solid ${methodColor}30;">${data.method}</span>
                <h3 style="font-size:1.5rem; font-weight:700;">${data.title}</h3>
            </div>
            
            <div class="url-bar">
                <span style="opacity:0.4">http://127.0.0.1:8000/api</span><span class="url-path">${data.path}</span>
            </div>

            <p style="margin-bottom: 2.5rem; color: #d4d4d8; line-height: 1.6;">${data.desc}</p>

            <h4 style="margin-bottom: 1rem; font-size: 0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-text-muted);">Request Parameters</h4>
            ${paramHTML}

            <div class="console">
                <div class="console-header">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <!-- MAC BUTTONS -->
                        <div class="window-controls">
                            <div class="control mac-red"></div>
                            <div class="control mac-yellow"></div>
                            <div class="control mac-green"></div>
                        </div>
                        <span class="console-label" style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); margin-left:8px;">RESPONSE</span>
                        <!-- Status Indicator Placeholder -->
                        <div id="status-indicator-${index}" class="status-indicator">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                    <div style="display:flex; gap:8px;">
                         <button class="btn btn--danger btn--sm" style="padding:0.4rem 0.8rem; font-size:0.75rem;" onclick="runSim(this, ${index}, 'error')">Test Error</button>
                         <button class="btn btn--primary btn--sm" style="padding:0.4rem 0.8rem; font-size:0.75rem;" onclick="runSim(this, ${index}, 'success')">Send Request</button>
                    </div>
                </div>
                <div class="console-body send-request" id="console-output-${index}">
                    <span style="opacity:0.4; font-style:italic;">// Click 'Send Request' or 'Test Error' to simulate...</span>
                </div>
            </div>
        </div>
    `;
};

window.runSim = (btn, index, type) => {
    const output = document.getElementById(`console-output-${index}`);
    const statusInd = document.getElementById(`status-indicator-${index}`);
    const originalText = btn.innerText;
    const data = endpoints[index];

    // Disable button state
    btn.innerText = "Processing...";
    btn.disabled = true;
    btn.style.opacity = "0.7";
    statusInd.classList.remove('visible'); // Hide old status
    
    output.innerHTML = `<span style="color:#fbbf24">// Connecting to server...</span>`;

    setTimeout(() => {
        let responseData, statusCode, statusClass;

        if (type === 'error') {
            responseData = data.error_response;
            statusCode = data.error_status;
            statusClass = `status-${statusCode}`;
        } else {
            responseData = data.response;
            statusCode = data.status;
            statusClass = `status-${statusCode}`;
        }

        let statusMsg = 'OK';
        if (statusCode === 201) statusMsg = 'Created';
        if (statusCode === 400) statusMsg = 'Bad Request';
        if (statusCode === 401) statusMsg = 'Unauthorized';
        if (statusCode === 422) statusMsg = 'Unprocessable Content';
        if (statusCode === 500) statusMsg = 'Server Error';

        output.innerHTML = highlightJSON(responseData);
        
        statusInd.className = `status-indicator visible ${statusClass}`;
        statusInd.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                ${type === 'error' ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' : '<polyline points="20 6 9 17 4 12"></polyline>'}
            </svg>
            ${statusCode} ${statusMsg}
        `;

        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.opacity = "1";

    }, 600);
};

renderSidebar();
const firstItem = document.querySelector('.sidebar-item');
if(firstItem) loadEndpoint(0, firstItem);