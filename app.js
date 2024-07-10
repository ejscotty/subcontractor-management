// Admin credentials (in a real app, this would be server-side)
const adminCredentials = { username: 'admin', password: 'adminpass' };

// DOM elements
const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const contractorPanel = document.getElementById('contractorPanel');
const siteList = document.getElementById('siteList');
const siteSelect = document.getElementById('siteSelect');
const currentlySignedInTable = document.getElementById('currentlySignedIn').querySelector('tbody');
const allSitesTable = document.getElementById('allSitesTable').querySelector('tbody');

// Data
let sites = JSON.parse(localStorage.getItem('sites')) || [];
let subcontractors = JSON.parse(localStorage.getItem('subcontractors')) || [];

// Functions
function updateLocalStorage() {
    localStorage.setItem('sites', JSON.stringify(sites));
    localStorage.setItem('subcontractors', JSON.stringify(subcontractors));
}

function updateSitesList() {
    siteList.innerHTML = '';
    siteSelect.innerHTML = '<option value="">Select a site</option>';
    sites.forEach((site, index) => {
        siteList.innerHTML += `<li>${site} <button onclick="deleteSite(${index})">Delete</button></li>`;
        siteSelect.innerHTML += `<option value="${site}">${site}</option>`;
    });
}

function deleteSite(index) {
    const siteName = sites[index];
    sites.splice(index, 1);
    subcontractors = subcontractors.filter(sub => sub.site !== siteName);
    updateSitesList();
    updateLocalStorage();
    updateSubcontractorTable();
    updateAllSitesTable();
}

function updateSubcontractorTable(site) {
    currentlySignedInTable.innerHTML = '';
    const siteContractors = subcontractors.filter(sub => sub.site === site);
    siteContractors.forEach(sub => {
        currentlySignedInTable.innerHTML += `
            <tr>
                <td>${sub.name}</td>
                <td>${sub.company}</td>
                <td>${new Date(sub.signInTime).toLocaleString()}</td>
            </tr>
        `;
    });
}

function updateAllSitesTable() {
    allSitesTable.innerHTML = '';
    subcontractors.forEach(sub => {
        allSitesTable.innerHTML += `
            <tr>
                <td>${sub.name}</td>
                <td>${sub.company}</td>
                <td>${sub.site}</td>
                <td>${new Date(sub.signInTime).toLocaleString()}</td>
            </tr>
        `;
    });
}

// Event Listeners
document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === adminCredentials.username && password === adminCredentials.password) {
        loginForm.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        contractorPanel.classList.add('hidden');
        updateSitesList();
        updateAllSitesTable();
    } else {
        alert('Invalid username or password');
    }
});

document.getElementById('addSiteButton').addEventListener('click', () => {
    const siteName = document.getElementById('siteName').value.trim();
    if (siteName && !sites.includes(siteName)) {
        sites.push(siteName);
        document.getElementById('siteName').value = '';
        updateSitesList();
        updateLocalStorage();
    } else {
        alert('Please enter a unique site name');
    }
});

siteSelect.addEventListener('change', (e) => {
    const selectedSite = e.target.value;
    updateSubcontractorTable(selectedSite);
});

document.getElementById('signInOutButton').addEventListener('click', () => {
    const site = siteSelect.value;
    const name = document.getElementById('name').value.trim();
    const company = document.getElementById('company').value.trim();
    if (site && name && company) {
        const existingIndex = subcontractors.findIndex(s => s.name === name && s.company === company && s.site === site);
        if (existingIndex === -1) {
            // Sign in
            subcontractors.push({ name, company, site, signInTime: new Date().toISOString() });
            document.getElementById('status').textContent = `${name} signed in to ${site}`;
        } else {
            // Sign out
            subcontractors.splice(existingIndex, 1);
            document.getElementById('status').textContent = `${name} signed out from ${site}`;
        }
        updateLocalStorage();
        updateSubcontractorTable(site);
    } else {
        alert('Please fill in all fields');
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    adminPanel.classList.add('hidden');
    loginForm.classList.remove('hidden');
    contractorPanel.classList.remove('hidden');
});

// Initial setup
updateSitesList();
updateAllSitesTable();
