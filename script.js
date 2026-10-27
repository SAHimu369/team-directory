const STORAGE_KEY = 'team_directory_records_v4';

const defaultContacts = [
    { id: 1, department: "Engineering", name: "Shakil Ahommed Himu", nationality: "Bangladeshi", jobTitle: "Senior Developer", fromSource: "own", isPresent: true },
    { id: 2, department: "Operations", name: "Ahmed Al-Mutairi", nationality: "Saudi", jobTitle: "Project Coordinator", fromSource: "aamcom", isPresent: false },
    { id: 3, department: "Management", name: "John Smith", nationality: "British", jobTitle: "Consultant", fromSource: "business visa", isPresent: true }
];

let contacts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultContacts;

function renderContacts(list) {
    const grid = document.getElementById('contact-grid');
    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = `<div class="no-results">No directory records found.</div>`;
        return;
    }

    list.forEach(c => {
        const initials = c.name ? c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'TD';
        
        let badgeClass = 'badge-own';
        const sourceVal = (c.fromSource || '').toLowerCase().trim();
        if (sourceVal === 'aamcom') badgeClass = 'badge-aamcom';
        else if (sourceVal === 'ekis') badgeClass = 'badge-ekis';
        else if (sourceVal.includes('business')) badgeClass = 'badge-business';

        const isChecked = c.isPresent ? 'present' : '';
        const attendanceText = c.isPresent ? '✓ Present Today' : 'Mark Present';

        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <div class="profile-section">
                <div class="avatar">${initials}</div>
                <div class="contact-info">
                    <h2>${c.name}</h2>
                    <p>${c.jobTitle}</p>
                </div>
            </div>
            <div class="details-section">
                <div class="detail-item">
                    <span class="detail-label">Dept:</span>
                    <span class="detail-value">${c.department}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Nationality:</span>
                    <span class="detail-value">${c.nationality}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status/From:</span>
                    <span class="detail-value"><span class="badge ${badgeClass}">${c.fromSource}</span></span>
                </div>
            </div>
            <div class="actions">
                <button class="btn-action btn-attendance ${isChecked}" onclick="toggleAttendance(${c.id})">${attendanceText}</button>
                <button class="btn-action btn-delete" onclick="deleteContact(${c.id})" title="Delete Record">🗑</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function toggleAttendance(id) {
    contacts = contacts.map(c => {
        if (c.id === id) {
            return { ...c, isPresent: !c.isPresent };
        }
        return c;
    });
    saveAndRender();
}

function updateDashboard() {
    document.getElementById('stat-total').innerText = contacts.length;

    const deptCounts = {};
    const natCounts = {};
    const attendanceNatCounts = {};

    contacts.forEach(c => {
        const dept = c.department ? c.department.trim() : 'Unassigned';
        const nat = c.nationality ? c.nationality.trim() : 'Unknown';
        
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        natCounts[nat] = (natCounts[nat] || 0) + 1;

        if (c.isPresent) {
            attendanceNatCounts[nat] = (attendanceNatCounts[nat] || 0) + 1;
        }
    });

    // Render Department Breakdown
    const deptContainer = document.getElementById('stat-departments');
    deptContainer.innerHTML = '';
    for (const [dept, count] of Object.entries(deptCounts)) {
        deptContainer.innerHTML += `<div class="stat-item"><span>${dept}</span><span>${count}</span></div>`;
    }

    // Render Nationality Breakdown
    const natContainer = document.getElementById('stat-nationalities');
    natContainer.innerHTML = '';
    for (const [nat, count] of Object.entries(natCounts)) {
        natContainer.innerHTML += `<div class="stat-item"><span>${nat}</span><span>${count}</span></div>`;
    }

    // Render Attendance by Nationality Breakdown
    const attNatContainer = document.getElementById('stat-attendance-nationality');
    attNatContainer.innerHTML = '';
    const attKeys = Object.keys(attendanceNatCounts);
    if (attKeys.length === 0) {
        attNatContainer.innerHTML = `<div class="stat-item" style="color:var(--text-muted);"><span>No one marked present today</span></div>`;
    } else {
        for (const [nat, count] of Object.entries(attendanceNatCounts)) {
            attNatContainer.innerHTML += `<div class="stat-item"><span>${nat}</span><span>${count} Working</span></div>`;
        }
    }
}

function toggleModal(show) {
    document.getElementById('modal-overlay').style.display = show ? 'flex' : 'none';
    if(show) {
        document.getElementById('contact-form').reset();
        document.getElementById('contact-id').value = '';
        document.getElementById('modal-title').innerText = 'Add Newcomer';
    }
}

function saveContact(e) {
    e.preventDefault();
    const idField = document.getElementById('contact-id').value;
    
    const contactData = {
        id: idField ? Number(idField) : Date.now(),
        department: document.getElementById('department').value.trim(),
        name: document.getElementById('name').value.trim(),
        nationality: document.getElementById('nationality').value.trim(),
        jobTitle: document.getElementById('jobTitle').value.trim(),
        fromSource: document.getElementById('fromSource').value.trim().toLowerCase(),
        isPresent: false
    };

    if(idField) {
        const existing = contacts.find(c => c.id === contactData.id);
        if (existing) contactData.isPresent = existing.isPresent;
        contacts = contacts.map(c => c.id === contactData.id ? contactData : c);
    } else {
        contacts.unshift(contactData);
    }

    saveAndRender();
    toggleModal(false);
}

function deleteContact(id) {
    if(confirm('Are you sure you want to delete this record?')) {
        contacts = contacts.filter(c => c.id !== id);
        saveAndRender();
    }
}

function filterContacts() {
    const query = document.getElementById('search-box').value.toLowerCase();

    const filtered = contacts.filter(c => {
        return (
            (c.name && c.name.toLowerCase().includes(query)) || 
            (c.department && c.department.toLowerCase().includes(query)) || 
            (c.jobTitle && c.jobTitle.toLowerCase().includes(query)) || 
            (c.nationality && c.nationality.toLowerCase().includes(query)) ||
            (c.fromSource && c.fromSource.toLowerCase().includes(query))
        );
    });

    renderContacts(filtered);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    reader.onload = function(e) {
        const content = e.target.result;
        try {
            if (fileName.endsWith('.json')) {
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed)) {
                    contacts = parsed.map((item, index) => ({
                        id: item.id || Date.now() + index,
                        department: item.department || item.Dept || 'General',
                        name: item.name || item.FullName || 'Unknown',
                        nationality: item.nationality || item.Nationality || 'Unknown',
                        jobTitle: item.jobTitle || item.Title || item.Role || 'Staff',
                        fromSource: normalizeSource(item.fromSource || item.From || 'own'),
                        isPresent: item.isPresent || false
                    }));
                    saveAndRender();
                    alert('JSON list successfully imported and arranged!');
                } else {
                    alert('Invalid JSON format. Expected an array of records.');
                }
            } else if (fileName.endsWith('.csv')) {
                const lines = content.split('\n').filter(l => l.trim() !== '');
                if (lines.length < 2) {
                    alert('CSV file appears empty or missing headers.');
                    return;
                }
                
                const newRecords = [];
                for (let i = 1; i < lines.length; i++) {
                    const currentLine = lines[i].split(',').map(val => val.trim().replace(/^["'](.+)["']$/, '$1'));
                    if (currentLine.length >= 4) {
                        newRecords.push({
                            id: Date.now() + i,
                            department: currentLine[0] || 'General',
                            name: currentLine[1] || 'Unknown',
                            nationality: currentLine[2] || 'Unknown',
                            jobTitle: currentLine[3] || 'Staff',
                            fromSource: normalizeSource(currentLine[4] || 'own'),
                            isPresent: false
                        });
                    }
                }

                if (newRecords.length > 0) {
                    contacts = newRecords;
                    saveAndRender();
                    alert('CSV list successfully uploaded and arranged!');
                } else {
                    alert('Could not parse records from CSV. Ensure columns follow: Department, Full Name, Nationality, Job Title, From');
                }
            }
        } catch (err) {
            console.error(err);
            alert('Error parsing uploaded file.');
        }
        event.target.value = '';
    };

    reader.readAsText(file);
}

function normalizeSource(val) {
    const clean = val.toLowerCase().trim();
    if (['own', 'aamcom', 'ekis', 'business visa'].includes(clean)) {
        return clean;
    }
    return 'own';
}

function saveAndRender() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    renderContacts(contacts);
    updateDashboard();
}

// Initial render call on load
renderContacts(contacts);
updateDashboard();