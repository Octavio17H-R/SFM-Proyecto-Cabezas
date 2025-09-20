// --- SVG Icons ---
const icons = {
    shopfloor: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H8a2.5 2.5 0 0 1 5 0h2.5a2.5 2.5 0 0 1 2.5 2.5V20h-12v-1.5Z"/><path d="m12 11 2-3"/><path d="m12 11-2-3"/><path d="M12 11v-1"/><path d="M12 8V7"/><path d="M10 5.5 12 4l2 1.5"/><path d="M4 16V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v11"/><path d="M4 11h16"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    kombiblat: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
    teams: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    tpm: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-teal-600"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    planning: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    quality: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    costs: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    speed: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-500"><path d="m12 12-2-5 2-5 2 5 2 5-4 0z"/><path d="m12 12 5 2-5 2-5-2 5-2z"/></svg>`,
    vacation: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-lime-500"><path d="M12 22v-8"/><path d="M12 22a8.2 8.2 0 0 1-4.2-1.2c-1-.6-2.5-1.8-2.5-3.3a2.5 2.5 0 0 1 2.5-2.5c1.2 0 2.2.9 2.2 2.2a2.2 2.2 0 0 0 4.4 0c0-1.3 1-2.2 2.2-2.2a2.5 2.5 0 0 1 2.5 2.5c0 1.5-1.5 2.7-2.5 3.3A8.2 8.2 0 0 1 12 22Z"/></svg>`,
    training: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-pink-500"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v16H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
};


// --- Colores por día ---
const dayColors = { 
    'L': 'bg-blue-500', 
    'M': 'bg-green-500', 
    'MI': 'bg-yellow-500', 
    'J': 'bg-red-500', 
    'V': 'bg-purple-500' 
};

// --- Data for the cards ---
const dashboardData = [
    // AGENDA
    { id: 'agenda-1', column: 'agenda', icon: icons.shopfloor, title: 'Apertura de junta', time: '6:45-6:46' },
    { id: 'agenda-2', column: 'agenda', icon: icons.heart, title: 'Stocks Corazones', time: '6:46-6:55' },
    { id: 'agenda-3', column: 'agenda', icon: icons.kombiblat, title: 'Kombiblatt: puntos en rojo y acciones', time: '6:56-6:58' },
    { id: 'agenda-4', column: 'agenda', icon: icons.teams, title: 'Situación Actual de Equipos', time: '6:58-7:00' },
    // DIARIO
    { id: 'diario-1', column: 'diario', icon: icons.shopfloor, title: 'Reporte Cierre Semanal' },
    { id: 'diario-2', column: 'diario', icon: icons.lightbulb, title: 'Seguimiento SdP' },
    { id: 'diario-3', column: 'diario', icon: icons.planning, title: 'Planificación EMOS' },
    { id: 'diario-4', column: 'diario', icon: icons.warning, title: 'Accidentabilidad' },
    // SEMANAL
    { id: 'semanal-1', column: 'semanal', icon: icons.tpm, title: 'Mantenimiento Herramentales' },
    { id: 'semanal-2', column: 'semanal', icon: icons.tpm, title: 'Mantenimiento Máquinas Críticas' },
    { id: 'semanal-3', column: 'semanal', icon: icons.quality, title: 'Fallas de calidad' },
    // MENSUAL
    { id: 'mensual-1', column: 'mensual', icon: icons.costs, title: 'Costos' },
    { id: 'mensual-2', column: 'mensual', icon: icons.teams, title: 'FPK / VBZ' },
    { id: 'mensual-3', column: 'mensual', icon: icons.speed, title: 'SPEED+' },
    { id: 'mensual-4', column: 'mensual', icon: icons.vacation, title: 'Saldo de vacaciones' },
    { id: 'mensual-5', column: 'mensual', icon: icons.training, title: 'Capacitación' },
];

// --- Crear tarjeta ---
function createCard(item) {
    const savedData = JSON.parse(localStorage.getItem("tasksData")) || {};
    const savedItem = savedData[item.id] || {};
    const timeValue = savedItem.time || item.time || '';
    const isChecked = savedItem.completed ? "checked" : "";

    const timeField = item.time ? `<input type="text" value="${timeValue}" data-id="${item.id}" class="time-input text-sm font-semibold text-gray-800">` : '';

    let daysHTML = '';
    let checkboxHTML = '';

    // Solo SEMANAL y MENSUAL
    if(item.column === 'semanal' || item.column === 'mensual') {
        checkboxHTML = `<input type="checkbox" class="task-check w-5 h-5 flex-none" data-id="${item.id}" ${isChecked}>`;

        const savedDays = savedItem.days || [];
        daysHTML = ['L','M','MI','J','V'].map(d => {
            const activeClass = savedDays.includes(d) ? 'bg-gray-800' : dayColors[d];
            return `<span class="day-circle w-6 h-6 rounded-full ${activeClass} text-white flex items-center justify-center font-bold text-xs cursor-pointer" data-id="${item.id}" data-day="${d}">${d}</span>`;
        }).join('');
    }

    return `
        <div class="card p-4 flex flex-col gap-3 custom-shadow custom-shadow-hover transition-shadow duration-300">
            <div class="flex items-center gap-3">
                ${checkboxHTML}
                <div class="flex-shrink-0 w-12 h-12">${item.icon}</div>
                <div class="flex-grow">
                    ${timeField}
                    <p class="text-md ${item.time ? 'text-secondary' : 'font-semibold text-gray-800'}">${item.title}</p>
                </div>
            </div>
            ${daysHTML ? `<div class="flex justify-center gap-2 mt-2">${daysHTML}</div>` : ''}
        </div>
    `;
}



// --- Renderizar dashboard ---
function renderDashboard() {
    ['agenda','diario','semanal','mensual'].forEach(col => document.getElementById(`${col}-cards`).innerHTML = '');
    dashboardData.forEach(item => {
        const container = document.getElementById(`${item.column}-cards`);
        if(container) container.innerHTML += createCard(item);
    });
}

// --- Guardar cambios de hora y checkbox ---
document.getElementById('dashboard-main').addEventListener('change', (event) => {
    const tasksData = JSON.parse(localStorage.getItem("tasksData")) || {};

    if(event.target.classList.contains("time-input")) {
        const id = event.target.dataset.id;
        if(!tasksData[id]) tasksData[id] = {};
        tasksData[id].time = event.target.value;
    }

    if(event.target.classList.contains("task-check")) {
        const id = event.target.dataset.id;
        if(!tasksData[id]) tasksData[id] = {};
        tasksData[id].completed = event.target.checked;
    }

    localStorage.setItem("tasksData", JSON.stringify(tasksData));
});

// --- Clic en círculo de día ---
document.getElementById('dashboard-main').addEventListener('click', (event) => {
    if(event.target.classList.contains('day-circle')) {
        const id = event.target.dataset.id;
        const day = event.target.dataset.day;
        const tasksData = JSON.parse(localStorage.getItem("tasksData")) || {};
        if(!tasksData[id]) tasksData[id] = {};
        if(!tasksData[id].days) tasksData[id].days = [];

        if(tasksData[id].days.includes(day)) {
            tasksData[id].days = tasksData[id].days.filter(d => d !== day);
        } else {
            tasksData[id].days.push(day);
        }

        localStorage.setItem("tasksData", JSON.stringify(tasksData));
        renderDashboard(); // re-render para actualizar color
    }
});

// --- Inicializar ---
document.addEventListener('DOMContentLoaded', renderDashboard);