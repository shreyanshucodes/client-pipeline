// Data Models
const STAGES = [
    { id: 'Lead', name: 'Lead', color: 'var(--col-lead)' },
    { id: 'Contacted', name: 'Contacted', color: 'var(--col-contacted)' },
    { id: 'Meeting Scheduled', name: 'Meeting Scheduled', color: 'var(--col-meeting)' },
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
        clients = JSON.parse(data);
    }
}

function saveData() {
    localStorage.setItem('pipelineData', JSON.stringify(clients));
    updateStats();
}

async function loadSampleData() {
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            const data = await response.json();
            clients = data;
            saveData();
            renderBoard();
        } else {
            alert('Could not load sample data.');
        }
    } catch (e) {
        console.error(e);
        alert('Error loading sample data. Are you running via a local server?');
    }
}

// Rendering
function renderBoard() {
    board.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    const sortVal = sortSelect.value;
    
    // Sort logic
    let sortedClients = [...clients];
    if (sortVal === 'date-desc') sortedClients.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortVal === 'date-asc') sortedClients.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortVal === 'val-desc') sortedClients.sort((a, b) => b.value - a.value);
    if (sortVal === 'val-asc') sortedClients.sort((a, b) => a.value - b.value);

    // Filter logic
    const filteredClients = sortedClients.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        (c.company && c.company.toLowerCase().includes(searchTerm))
    );

    STAGES.forEach(stage => {
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
                const client = clients.find(c => c.id == clientId);
                if (client && client.stage !== stage.id) {
                    client.stage = stage.id;
                    client.date = new Date().toISOString();
                    saveData();
                    renderBoard();
                }
            }
        });

        stageClients.forEach(client => {
            const card = createCard(client);
            body.appendChild(card);
        });

        board.appendChild(col);
    });
}

function createCard(client) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = client.id;
    
    const formattedVal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(client.value || 0);
    const formattedDate = new Date(client.date).toLocaleDateString();

    card.innerHTML = `
        <div class="card-header">
            <div class="card-title">${client.name}</div>
            <div class="card-actions">
                <i class="fas fa-edit edit-btn" title="Edit"></i>
                <i class="fas fa-trash delete-btn" title="Delete"></i>
            </div>
        </div>
        ${client.company ? \`<div class="card-company">\${client.company}</div>\` : ''}
        <div class="card-value">\${formattedVal}</div>
        <div class="card-date">Updated: \${formattedDate}</div>
        ${client.notes ? \`<div class="card-notes">\${client.notes}</div>\` : ''}
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
    card.querySelector('.edit-btn').addEventListener('click', () => openModal(client));
    card.querySelector('.delete-btn').addEventListener('click', () => {
        if(confirm('Are you sure you want to delete this client?')) {
            clients = clients.filter(c => c.id !== client.id);
            saveData();
            renderBoard();
        }
    });

    return card;
}

// Stats
function updateStats() {
    const leads = clients.length;
    const totalVal = clients.reduce((sum, c) => sum + (Number(c.value) || 0), 0);
    const won = clients.filter(c => c.stage === 'Won').length;
    const conversion = leads > 0 ? Math.round((won / leads) * 100) : 0;

    document.getElementById('stat-leads').textContent = leads;
    document.getElementById('stat-value').textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(totalVal);
    document.getElementById('stat-conversion').textContent = \`\${conversion}%\`;
}

// Modal & Form
function openModal(client = null) {
    modal.classList.add('active');
    document.getElementById('modal-title').textContent = client ? 'Edit Client' : 'Add Client';
    
    if (client) {
        document.getElementById('client-id').value = client.id;
        document.getElementById('client-name').value = client.name;
        document.getElementById('client-company').value = client.company || '';
        document.getElementById('client-value').value = client.value || 0;
        document.getElementById('client-stage').value = client.stage;
        document.getElementById('client-notes').value = client.notes || '';
    } else {
        form.reset();
        document.getElementById('client-id').value = '';
    }
}

function closeModal() {
    modal.classList.remove('active');
}

// Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('client-id').value;
        const newClient = {
            id: id ? Number(id) : Date.now(),
            name: document.getElementById('client-name').value,
            company: document.getElementById('client-company').value,
            value: Number(document.getElementById('client-value').value),
            stage: document.getElementById('client-stage').value,
            notes: document.getElementById('client-notes').value,
            date: new Date().toISOString()
        };

        if (id) {
            clients = clients.map(c => c.id === newClient.id ? newClient : c);
        } else {
            clients.push(newClient);
        }

        saveData();
        renderBoard();
        closeModal();
    });

    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    exportBtn.addEventListener('click', exportToCSV);
    loadSampleBtn.addEventListener('click', loadSampleData);
    
    searchInput.addEventListener('input', renderBoard);
    sortSelect.addEventListener('change', renderBoard);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function exportToCSV() {
    if (clients.length === 0) return alert('No data to export');
    
    const headers = ['Name', 'Company', 'Value', 'Stage', 'Date', 'Notes'];
    const csvRows = [headers.join(',')];
    
    clients.forEach(c => {
        const values = [
            \`"\${c.name}"\`,
            \`"\${c.company || ''}"\`,
            c.value || 0,
            \`"\${c.stage}"\`,
            \`"\${new Date(c.date).toLocaleDateString()}"\`,
            \`"\${(c.notes || '').replace(/"/g, '""')}"\`
        ];
        csvRows.push(values.join(','));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pipeline_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Start
init();
