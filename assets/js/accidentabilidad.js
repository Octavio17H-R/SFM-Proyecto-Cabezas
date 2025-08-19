document.addEventListener('DOMContentLoaded', function() {
  const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  let selectedDayType = null;
  let calendarData = []; // Datos diarios: {dia, mes, tipo, area, estatus, calificacion}
  
  const calendarDaysContainer = document.getElementById('calendar-days');
  const monthlySummaryBody = document.getElementById('monthly-summary-body');

  // Crear calendario cruz con días
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
          const dayInfo = calendarData.find(d => d.dia === dayNum && d.mes === currentMonth);
          if (dayInfo) dayElement.classList.add(dayInfo.tipo);

          dayElement.addEventListener('click', () => {
            if (!selectedDayType) return;

            // Actualizar estilo del día
            dayElement.className = 'calendar-day d-flex align-items-center justify-content-center rounded border mx-1';
            dayElement.style.width = '40px';
            dayElement.style.height = '40px';
            dayElement.style.cursor = 'pointer';
            dayElement.style.userSelect = 'none';
            dayElement.classList.add(selectedDayType);

            // Actualizar datos calendarData (ejemplo con valores genéricos para area, estatus y calificacion)
            updateCalendarData(dayNum, currentMonth, selectedDayType, 'Área Genérica', 'Completado', 'Alta');

            renderMonthlySummary();
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

  // Agrega o actualiza un día en calendarData
  function updateCalendarData(dia, mes, tipo, area = '', estatus = '', calificacion = '') {
    const index = calendarData.findIndex(d => d.dia === dia && d.mes === mes);
    if (index >= 0) {
      calendarData[index] = {dia, mes, tipo, area, estatus, calificacion};
    } else {
      calendarData.push({dia, mes, tipo, area, estatus, calificacion});
    }
  }

  // Genera resumen mensual calculado desde calendarData (si no se carga desde Excel)
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
      if (tipo === 'accident') {
        summary[mes].cantidad++;
      }
      if (area) summary[mes].areas.add(area);
      if (estatus) summary[mes].estatuses.add(estatus);
      if (calificacion) summary[mes].calificaciones.add(calificacion);
    });

    // Convertir sets a texto
    Object.keys(summary).forEach(mes => {
      summary[mes].areas = Array.from(summary[mes].areas).join(', ');
      summary[mes].estatuses = Array.from(summary[mes].estatuses).join(', ');
      summary[mes].calificaciones = Array.from(summary[mes].calificaciones).join(', ');
    });
    return summary;
  }

  // Renderiza tabla resumen mensual usando datos calculados
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

  // Renderizar resumen desde hoja Excel "Resumen Mensual"
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

  // Función para cargar el Excel automáticamente desde una ruta local dentro del proyecto
  function loadExcelFromUrl(url) {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar el archivo");
        return response.arrayBuffer();
      })
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });

        // Leer hoja "Diario"
        const diarioSheet = workbook.Sheets['Diario'];
        if (!diarioSheet) {
          alert('No se encontró la hoja "Diario"');
          return;
        }
        const diarioData = XLSX.utils.sheet_to_json(diarioSheet, { defval: '' });
        calendarData = diarioData.map(row => ({
          dia: parseInt(row.Día),
          mes: row.Mes,
          tipo: row.Tipo,
          area: row.AREA || '',
          estatus: row.ESTATUS || '',
          calificacion: row.CALIFICACION || ''
        }));

        // Leer hoja "Resumen Mensual"
        const resumenSheet = workbook.Sheets['Resumen Mensual'];
        let resumenData = [];
        if (resumenSheet) {
          resumenData = XLSX.utils.sheet_to_json(resumenSheet, { defval: '' });
        }

        // Mostrar calendario con mes actual
        const currentMonth = monthNames[new Date().getMonth()];
        createCrossCalendar(currentMonth);

        // Renderizar resumen (usar datos de Excel si hay, si no calcular)
        if (resumenData.length > 0) {
          renderResumenDesdeExcel(resumenData);
        } else {
          renderMonthlySummary();
        }
      })
      .catch(error => {
        alert("Error cargando archivo Excel: " + error.message);
        // Inicializar calendario vacío si falla la carga
        createCrossCalendar(monthNames[new Date().getMonth()]);
        renderMonthlySummary();
      });
  }

  function exportToExcel() {
    // Datos para hoja "Diario"
    const diarioData = calendarData.map(d => ({
      Día: d.dia,
      Mes: d.mes,
      Tipo: d.tipo,
      AREA: d.area,
      ESTATUS: d.estatus,
      CALIFICACION: d.calificacion
    }));

    // Generar resumen mensual
    const resumen = generateMonthlySummary();

    // Convertir resumen a formato array para exportar
    const resumenData = Object.keys(resumen).map(mes => ({
      Mes: mes,
      Cantidad_Total: resumen[mes].cantidad,
      Áreas: resumen[mes].areas,
      Estatus_General: resumen[mes].estatuses,
      Calificación_General: resumen[mes].calificaciones
    }));

    const wb = XLSX.utils.book_new();

    // Crear hoja "Diario"
    const wsDiario = XLSX.utils.json_to_sheet(diarioData);
    XLSX.utils.book_append_sheet(wb, wsDiario, 'Diario');

    // Crear hoja "Resumen Mensual"
    const wsResumen = XLSX.utils.json_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Mensual');

    // Guardar archivo Excel con dos hojas
    XLSX.writeFile(wb, 'accidentabilidad.xlsx');
  }

  // Botones para seleccionar tipo de día
  document.querySelectorAll('.day-control').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDayType = btn.dataset.type;
      document.querySelectorAll('.day-control').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Listener para botón guardar cambios
  document.getElementById('saveChangesBtn').addEventListener('click', exportToExcel);

  // Cargar Excel automáticamente desde ruta local dentro del proyecto
  loadExcelFromUrl('../assets/Archivos/Empleado/accidentabilidad.xlsx'); // <--- Cambia esta ruta a la ubicación real de tu Excel
});
