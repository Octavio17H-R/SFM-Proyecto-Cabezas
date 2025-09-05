document.addEventListener('DOMContentLoaded', function() {
  const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  let selectedDayType = null;
  let calendarData = []; // Todos los datos del excel
  let resumenData = [];

  const monthSelect = document.getElementById('month-select');
  let selectedMonth = monthNames[new Date().getMonth()]; // Siempre inicia con mes actual

  const calendarDaysContainer = document.getElementById('calendar-days');
  const monthlySummaryBody = document.getElementById('monthly-summary-body');

  function getCurrentCalendarData(mes) {
    return calendarData.filter(d => d.mes === mes);
  }

  function createCrossCalendar(currentMonth) {
    calendarDaysContainer.innerHTML = '';
    const crossRows = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30],
      [null, 31, null]
    ];

    const calendarDataForMonth = getCurrentCalendarData(currentMonth);

    crossRows.forEach(rowDays => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'calendar-row d-flex justify-content-center mb-1';

      rowDays.forEach(dayNum => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day d-flex align-items-center justify-content-center rounded border mx-1';
        dayElement.style.width = '40px';
        dayElement.style.height = '40px';
        dayElement.style.cursor = 'pointer';
        dayElement.style.userSelect = 'none';
        if (dayNum && dayNum <= 31) {
          dayElement.textContent = dayNum;
          dayElement.dataset.day = dayNum;

          // Buscar datos para este día y mes
          const dayInfo = calendarDataForMonth.find(d => d.dia == dayNum);
          if (dayInfo) dayElement.classList.add(dayInfo.tipo);

          // Click en día
          dayElement.addEventListener('click', () => {
           if (dayInfo && dayInfo.tipo === 'accident') {
              const container = document.getElementById('accidentImages');
              container.innerHTML = ''; // limpiar imágenes previas

              for (let i = 1; i <= 3; i++) {
                const imagePath = `../assets/Archivos/Empleado/Accidentes/${currentMonth}_${dayNum}_${i}.PNG`;
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = `Accidente ${i}`;
                img.style.maxWidth = "550px";
                img.style.borderRadius = "8px";
                img.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
                img.onerror = () => img.remove();
                container.appendChild(img);
              }

              const modal = new bootstrap.Modal(document.getElementById('accidentModal'));
              modal.show();
            } else if (selectedDayType) {
              dayElement.className = 'calendar-day d-flex align-items-center justify-content-center rounded border mx-1';
              dayElement.style.width = '40px';
              dayElement.style.height = '40px';
              dayElement.style.cursor = 'pointer';
              dayElement.style.userSelect = 'none';
              dayElement.classList.add(selectedDayType);

              updateCalendarData(dayNum, currentMonth, selectedDayType, 'Área Genérica', 'Completado', 'Alta');
              renderMonthlySummary();
            }
          });
        } else {
          dayElement.textContent = '';
          dayElement.style.visibility = 'hidden';
          dayElement.style.width = '40px';
          dayElement.style.height = '40px';
          dayElement.style.margin = '0 4px';
        }
        rowDiv.appendChild(dayElement);
      });
      calendarDaysContainer.appendChild(rowDiv);
    });
  }

  function updateCalendarData(dia, mes, tipo, area = '', estatus = '', calificacion = '') {
    const index = calendarData.findIndex(d => d.dia == dia && d.mes == mes);
    if (index >= 0) {
      calendarData[index] = {dia, mes, tipo, area, estatus, calificacion};
    } else {
      calendarData.push({dia, mes, tipo, area, estatus, calificacion});
    }
  }

  function generateMonthlySummary() {
    const summary = {};
    calendarData.forEach(({dia, mes, tipo, area, estatus, calificacion}) => {
      if (!summary[mes]) {
        summary[mes] = {
          cantidad: 0,
          areas: new Set(),
          estatuses: new Set(),
          calificaciones: new Set()
        };
      }
      if (tipo === 'accident') summary[mes].cantidad++;
      if (area) summary[mes].areas.add(area);
      if (estatus) summary[mes].estatuses.add(estatus);
      if (calificacion) summary[mes].calificaciones.add(calificacion);
    });

    Object.keys(summary).forEach(mes => {
      summary[mes].areas = Array.from(summary[mes].areas).join(', ');
      summary[mes].estatuses = Array.from(summary[mes].estatuses).join(', ');
      summary[mes].calificaciones = Array.from(summary[mes].calificaciones).join(', ');
    });
    return summary;
  }

  function renderMonthlySummary() {
    const summary = generateMonthlySummary();
    monthlySummaryBody.innerHTML = '';
    monthNames.forEach(mes => {
      const data = summary[mes] || {cantidad: 0, areas: '', estatuses: '', calificaciones: ''};
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${mes}</td>
        <td>${data.cantidad}</td>
        <td>${data.areas}</td>
        <td>${data.estatuses}</td>
        <td>${data.calificaciones}</td>
      `;
      monthlySummaryBody.appendChild(tr);
    });
  }

  function renderResumenDesdeExcel(resumenData) {
    monthlySummaryBody.innerHTML = '';
    monthNames.forEach(mes => {
      const fila = resumenData.find(r => r.Mes === mes) || {Cantidad_Total: 0, Áreas: '', Estatus_General: '', Calificación_General: ''};
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${mes}</td>
        <td>${fila.Cantidad_Total || fila.cantidad || 0}</td>
        <td>${fila.Áreas || fila.areas || ''}</td>
        <td>${fila.Estatus_General || fila.estatus_general || ''}</td>
        <td>${fila.Calificación_General || fila.calificacion_general || ''}</td>
      `;
      monthlySummaryBody.appendChild(tr);
    });
  }

  function loadExcelFromUrl(url) {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar el archivo");
        return response.arrayBuffer();
      })
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const diarioSheet = workbook.Sheets['Diario'];
        if (!diarioSheet) return alert('No se encontró la hoja "Diario"');
        const diarioData = XLSX.utils.sheet_to_json(diarioSheet, { defval: '' });
        calendarData = diarioData.map(row => ({
          dia: parseInt(row.Día),
          mes: row.Mes,
          tipo: row.Tipo,
          area: row.AREA || '',
          estatus: row.ESTATUS || '',
          calificacion: row.CALIFICACION || ''
        }));

        const resumenSheet = workbook.Sheets['Resumen Mensual'];
        resumenData = [];
        if (resumenSheet) resumenData = XLSX.utils.sheet_to_json(resumenSheet, { defval: '' });

        // Selecciona el mes actual (corriente) al cargar
        if (monthSelect) {
          monthSelect.value = monthNames[new Date().getMonth()];
          selectedMonth = monthSelect.value;
        }
        renderForSelectedMonth();
      })
      .catch(error => {
        alert("Error cargando archivo Excel: " + error.message);
        createCrossCalendar(selectedMonth);
        renderMonthlySummary();
      });
  }

  function exportToExcel() {
    const diarioData = calendarData.map(d => ({
      Día: d.dia,
      Mes: d.mes,
      Tipo: d.tipo,
      AREA: d.area,
      ESTATUS: d.estatus,
      CALIFICACION: d.calificacion
    }));

    const resumen = generateMonthlySummary();
    const resumenDataXls = Object.keys(resumen).map(mes => ({
      Mes: mes,
      Cantidad_Total: resumen[mes].cantidad,
      Áreas: resumen[mes].areas,
      Estatus_General: resumen[mes].estatuses,
      Calificación_General: resumen[mes].calificaciones
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(diarioData), 'Diario');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumenDataXls), 'Resumen Mensual');
    XLSX.writeFile(wb, 'accidentabilidad.xlsx');
  }

  function renderForSelectedMonth() {
    createCrossCalendar(selectedMonth);
    if (resumenData && resumenData.length > 0) {
      renderResumenDesdeExcel(resumenData);
    } else {
      renderMonthlySummary();
    }
  }

  document.querySelectorAll('.day-control').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDayType = btn.dataset.type;
      document.querySelectorAll('.day-control').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('saveChangesBtn').addEventListener('click', exportToExcel);

  if (monthSelect) {
    // Selecciona el mes corriente cuando la página se abre
    monthSelect.value = monthNames[new Date().getMonth()];
    selectedMonth = monthSelect.value;
    monthSelect.addEventListener('change', function() {
      selectedMonth = this.value;
      renderForSelectedMonth();
    });
  }

  loadExcelFromUrl('../assets/Archivos/Empleado/accidentabilidad.xlsx');
});
