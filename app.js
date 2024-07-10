// User data (in a real app, this would be server-side)
const users = [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'user', password: 'userpass', role: 'user' }
];

// DOM elements
const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const userPanel = document.getElementById('userPanel');
const siteList = document.getElementById('siteList');
const siteSelect = document.getElementById('siteSelect');
const currentlySignedInTable = document.getElementById('currentlySignedIn').querySelector('tbody');

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
    sites.splice(index, 1);
    updateSitesList();
    updateLocalStorage();
}

function updateSubcontractorTable() {
    currentlySignedInTable.innerHTML = '';
    subcontractors.forEach(sub => {
        currentlySignedInTable.innerHTML += `
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
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        loginForm.classList.add('hidden');
        if (user.role === 'admin') {
            adminPanel.classList.remove('hidden');
        } else {
            userPanel.classList.remove('hidden');
        }
        updateSitesList();
        updateSubcontractorTable();
    } else {
        alert('Invalid username or password');
    }
});

document.getElementById('addSiteButton').addEventListener('click', () => {
    const siteName = document.getElementById('siteName');
    if (siteName.value) {
        sites.push(siteName.value);
        siteName.value = '';
        updateSitesList();
        updateLocalStorage();
    }
});

document.getElementById('signInOutButton').addEventListener('click', () => {
    const site = siteSelect.value;
    const name = document.getElementById('name').value;
    const company = document.getElementById('company').value;
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
        updateSubcontractorTable();
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    adminPanel.classList.add('hidden');
    userPanel.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Initial setup
updateSitesList();
updateSubcontractorTable();
