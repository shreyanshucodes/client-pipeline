// Pre-configured rich sample data so the board is NEVER blank on first visit
const DEFAULT_CLIENTS = [
    { id: 1, name: "Ravi Kumar", company: "TechCorp India", value: 50000, stage: "Lead", notes: "Inbound lead interested in editing retainers", date: new Date().toISOString() },
    { id: 2, name: "Anita Sharma", company: "DesignPro Studio", value: 25000, stage: "Contacted", notes: "Sent outreach email, scheduled follow-up", date: new Date().toISOString() },
    { id: 3, name: "Vikram Singh", company: "Singh & Co Logistics", value: 120000, stage: "Meeting Scheduled", notes: "Zoom demo call scheduled for Thursday 3 PM", date: new Date().toISOString() },
    { id: 4, name: "Priya Patel", company: "Patel Enterprises", value: 75000, stage: "Proposal Sent", notes: "Submitted comprehensive scope and pricing quotation", date: new Date().toISOString() },
    { id: 5, name: "Arjun Menon", company: "Menon Digital", value: 200000, stage: "Negotiating", notes: "Discussing annual contract and volume discount", date: new Date().toISOString() },
    { id: 6, name: "Neha Gupta", company: "Gupta Retail Group", value: 45000, stage: "Won", notes: "Agreement signed! Advance payment confirmed", date: new Date().toISOString() },
    { id: 7, name: "Suresh Rao", company: "Rao Consulting", value: 30000, stage: "Lost", notes: "Postponed project till next financial quarter", date: new Date().toISOString() },
    { id: 8, name: "Divya Reddy", company: "Reddy AI Labs", value: 90000, stage: "Lead", notes: "Found profile via GitHub showcase", date: new Date().toISOString() },
    { id: 9, name: "Manoj Tiwari", company: "Tiwari Media", value: 60000, stage: "Contacted", notes: "Shared portfolio and sample deliverables", date: new Date().toISOString() },
    { id: 10, name: "Kavita Desai", company: "Desai Creative", value: 150000, stage: "Proposal Sent", notes: "Reviewing proposal with their executive team", date: new Date().toISOString() }
];

const STAGES = [
    { id: 'Lead', name: 'Lead', color: 'var(--col-lead)' },
    { id: 'Contacted', name: 'Contacted', color: 'var(--col-contacted)' },
    { id: 'Meeting Scheduled', name: 'Meeting', color: 'var(--col-meeting)' },
    { id: 'Proposal Sent', name: 'Proposal Sent', color: 'var(--col-proposal)' },
    { id: 'Negotiating', name: 'Negotiating', color: 'var(--col-negotiating)' },
    { id: 'Won', name: 'Won', color: 'var(--col-won)' },
    { id: 'Lost', name: 'Lost', color: 'var(--col-lost)' }
];

let clients = [];
let draggingCard = null;

// DOM Elements
const board = document.querySelector('.kanban-board');
const addBtn = document.getElementById('add-btn');
const modal = document.getElementById('client-modal');
const closeBtn = document.querySelector('.close-btn');
const form = document.getElementById('client-form');
const themeToggle = document.getElementById('theme-toggle');
const exportBtn = document.getElementById('export-btn');
const loadSampleBtn = document.getElementById('load-sample-btn');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// Initialization
function init() {
    loadData();
    renderBoard();
    updateStats();
    setupEventListeners();
    initTheme();
}

// Data Management
function loadData() {
    const data = localStorage.getItem('pipelineData');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                clients = parsed;
                return;
            }
        } catch (e) {
            console.warn('Invalid local storage data, loading defaults.');
        }
    }
    // Default fallback so page is NEVER empty
    clients = JSON.parse(JSON.stringify(DEFAULT_CLIENTS));
    saveData();
}

function saveData() {
    localStorage.setItem('pipelineData', JSON.stringify(clients));
    updateStats();
}

function resetSampleData() {
    clients = JSON.parse(JSON.stringify(DEFAULT_CLIENTS));
    saveData();
    renderBoard();
}

// Rendering
function renderBoard() {
    board.innerHTML = '';
    const searchTerm = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const sortVal = sortSelect ? sortSelect.value : 'date-desc';
    
    // Sort logic
    let sortedClients = [...clients];
    if (sortVal === 'date-desc') sortedClients.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortVal === 'date-asc') sortedClients.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortVal === 'val-desc') sortedClients.sort((a, b) => (b.value || 0) - (a.value || 0));
    if (sortVal === 'val-asc') sortedClients.sort((a, b) => (a.value || 0) - (b.value || 0));

    // Filter logic
    const filteredClients = sortedClients.filter(c => 
        (c.name && c.name.toLowerCase().includes(searchTerm)) || 
        (c.company && c.company.toLowerCase().includes(searchTerm)) ||
        (c.notes && c.notes.toLowerCase().includes(searchTerm))
    );

    STAGES.forEach((stage, stageIndex) => {
        const stageClients = filteredClients.filter(c => c.stage === stage.id);
        
        const col = document.createElement('div');
        col.className = 'column';
        col.dataset.stage = stage.id;
        
        col.innerHTML = `
            <div class="column-header" style="border-bottom-color: ${stage.color}">
                <span>${stage.name}</span>
                <span class="column-count">${stageClients.length}</span>
            </div>
            <div class="column-body"></div>
        `;
        
        const body = col.querySelector('.column-body');
        
        // Drag over events
        body.addEventListener('dragover', e => {
            e.preventDefault();
            body.classList.add('drag-over');
        });
        
        body.addEventListener('dragleave', () => {
            body.classList.remove('drag-over');
        });
        
        body.addEventListener('drop', e => {
            e.preventDefault();
            body.classList.remove('drag-over');
            if (draggingCard) {
                const clientId = draggingCard.dataset.id;
                const client = clients.find(c => String(c.id) === String(clientId));
                if (client && client.stage !== stage.id) {
                    client.stage = stage.id;
                    client.date = new Date().toISOString();
                    saveData();
                    renderBoard();
                }
            }
        });

        stageClients.forEach(client => {
            const card = createCard(client, stageIndex);
            body.appendChild(card);
        });

        board.appendChild(col);
    });
}

function createCard(client, stageIndex) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = client.id;
    
    const formattedVal = new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        maximumFractionDigits: 0 
    }).format(client.value || 0);

    const formattedDate = new Date(client.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
    });

    const canMoveLeft = stageIndex > 0;
    const canMoveRight = stageIndex < STAGES.length - 1;

    card.innerHTML = `
        <div class="card-header">
            <div class="card-title">${escapeHTML(client.name)}</div>
            <div class="card-actions">
                <i class="fas fa-edit edit-btn" title="Edit Client"></i>
                <i class="fas fa-trash delete-btn" title="Delete Client"></i>
            </div>
        </div>
        ${client.company ? `<div class="card-company"><i class="fas fa-building"></i> ${escapeHTML(client.company)}</div>` : ''}
        <div class="card-value">${formattedVal}</div>
        <div class="card-date"><i class="far fa-clock"></i> ${formattedDate}</div>
        ${client.notes ? `<div class="card-notes">${escapeHTML(client.notes)}</div>` : ''}
        <div class="card-quick-actions">
            ${canMoveLeft ? `<button class="move-btn move-prev" title="Move to previous stage"><i class="fas fa-arrow-left"></i> ${STAGES[stageIndex - 1].name}</button>` : '<span></span>'}
            ${canMoveRight ? `<button class="move-btn move-next" title="Move to next stage">${STAGES[stageIndex + 1].name} <i class="fas fa-arrow-right"></i></button>` : ''}
        </div>
    `;

    // Drag Events
    card.addEventListener('dragstart', () => {
        draggingCard = card;
        setTimeout(() => card.classList.add('dragging'), 0);
    });
    
    card.addEventListener('dragend', () => {
        draggingCard = null;
        card.classList.remove('dragging');
    });

    // Action Events
    card.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(client);
    });

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete client "${client.name}"?`)) {
            clients = clients.filter(c => String(c.id) !== String(client.id));
            saveData();
            renderBoard();
        }
    });

    const prevBtn = card.querySelector('.move-prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shiftStage(client, -1);
        });
    }

    const nextBtn = card.querySelector('.move-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shiftStage(client, 1);
        });
    }

    return card;
}

function shiftStage(client, direction) {
    const currentIndex = STAGES.findIndex(s => s.id === client.stage);
    if (currentIndex !== -1) {
        const targetIndex = currentIndex + direction;
        if (targetIndex >= 0 && targetIndex < STAGES.length) {
            client.stage = STAGES[targetIndex].id;
            client.date = new Date().toISOString();
            saveData();
            renderBoard();
        }
    }
}

// Stats
function updateStats() {
    const leads = clients.length;
    const totalVal = clients.reduce((sum, c) => sum + (Number(c.value) || 0), 0);
    const won = clients.filter(c => c.stage === 'Won').length;
    const conversion = leads > 0 ? Math.round((won / leads) * 100) : 0;

    const leadsEl = document.getElementById('stat-leads');
    const valueEl = document.getElementById('stat-value');
    const convEl = document.getElementById('stat-conversion');

    if (leadsEl) leadsEl.textContent = leads;
    if (valueEl) {
        valueEl.textContent = new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'INR', 
            maximumFractionDigits: 0 
        }).format(totalVal);
    }
    if (convEl) convEl.textContent = `${conversion}%`;
}

// Modal & Form
function openModal(client = null) {
    modal.classList.add('active');
    document.getElementById('modal-title').textContent = client ? 'Edit Client' : 'Add New Client';
    
    if (client) {
        document.getElementById('client-id').value = client.id;
        document.getElementById('client-name').value = client.name || '';
        document.getElementById('client-company').value = client.company || '';
        document.getElementById('client-value').value = client.value || 0;
        document.getElementById('client-stage').value = client.stage || 'Lead';
        document.getElementById('client-notes').value = client.notes || '';
    } else {
        form.reset();
        document.getElementById('client-id').value = '';
        document.getElementById('client-stage').value = 'Lead';
    }
}

function closeModal() {
    modal.classList.remove('active');
}

// Event Listeners
function setupEventListeners() {
    if (addBtn) addBtn.addEventListener('click', () => openModal());
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('client-id').value;
            const newClient = {
                id: id ? (isNaN(id) ? id : Number(id)) : Date.now(),
                name: document.getElementById('client-name').value.trim(),
                company: document.getElementById('client-company').value.trim(),
                value: Number(document.getElementById('client-value').value) || 0,
                stage: document.getElementById('client-stage').value,
                notes: document.getElementById('client-notes').value.trim(),
                date: new Date().toISOString()
            };

            if (id) {
                clients = clients.map(c => String(c.id) === String(newClient.id) ? newClient : c);
            } else {
                clients.push(newClient);
            }

            saveData();
            renderBoard();
            closeModal();
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const isDark = html.getAttribute('data-theme') === 'dark';
            const nextTheme = isDark ? 'light' : 'dark';
            html.setAttribute('data-theme', nextTheme);
            localStorage.setItem('pipeline_theme', nextTheme);
            themeToggle.innerHTML = nextTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    if (exportBtn) exportBtn.addEventListener('click', exportToCSV);
    if (loadSampleBtn) loadSampleBtn.addEventListener('click', resetSampleData);
    if (searchInput) searchInput.addEventListener('input', renderBoard);
    if (sortSelect) sortSelect.addEventListener('change', renderBoard);
}

function initTheme() {
    const savedTheme = localStorage.getItem('pipeline_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

function exportToCSV() {
    if (clients.length === 0) return alert('No client records to export.');
    
    const headers = ['Name', 'Company', 'Value (INR)', 'Stage', 'Date', 'Notes'];
    const csvRows = [headers.join(',')];
    
    clients.forEach(c => {
        const values = [
            `"${(c.name || '').replace(/"/g, '""')}"`,
            `"${(c.company || '').replace(/"/g, '""')}"`,
            c.value || 0,
            `"${c.stage}"`,
            `"${new Date(c.date).toLocaleDateString()}"`,
            `"${(c.notes || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(values.join(','));
    });
    
    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `client_pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

// Start
document.addEventListener('DOMContentLoaded', init);
if (document.readyState !== 'loading') {
    init();
}
