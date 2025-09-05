(async function () {
  'use strict';

  // --- Helpers ---
  const today = new Date();
  const dia = today.getDate();             // 5
  const mes = today.toLocaleString('es-ES', { month: 'long' }); // "septiembre"

  // Función para leer Excel como AOA
  async function readExcel(path) {
    const resp = await fetch(path);
    const buffer = await resp.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    return wb;
  }

  // --- 1. Accidentes (día actual) ---
  async function getAccidentesHoy() {
    const wb = await readExcel('../assets/Archivos/Empleado/accidentabilidad.xlsx');
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    console.log(rows);


    // Estructura: Día | Mes | Tipo | Area | Estatus | Calificación
    const accidentes = rows.filter(r =>
      parseInt(r[0], 10) === dia &&
      String(r[1]).toLowerCase() === mes.toLowerCase()
    );

    document.getElementById('accidentes-hoy').innerText = accidentes.length;
  }

  // --- 2. Productividad (día actual, por turno) ---
async function getProductividadHoyGrafica() {
  const wb = await readExcel('../assets/Archivos/Proceso/productividad.xlsx');
  const productos = ['EA888', 'EA211'];

  const datasets = [];

  productos.forEach(sheet => {
    if (!wb.SheetNames.includes(sheet)) return;
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, defval: '' });
    const dataRows = rows.slice(1); // Ignorar encabezado

    const row = dataRows.find(r => parseInt(r[0], 10) === dia);
    if (!row) return;

    datasets.push({
      label: sheet,
      data: [row[1] ?? 0, row[2] ?? 0, row[3] ?? 0],
      backgroundColor: sheet === 'EA888' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(255, 99, 132, 0.6)',
      borderColor: sheet === 'EA888' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    });
  });

  const ctx = document.getElementById('graficoProductividad').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['T1', 'T2', 'T3'],
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `Productividad del día ${dia} de ${mes.charAt(0).toUpperCase() + mes.slice(1)}`
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 5 }
        }
      }
    }
  });
}


  // --- 3. Desecho (día actual, por turno) ---
async function getDesechoHoyGrafica() {
  const wb = await readExcel('../assets/Archivos/Calidad/Desecho.xlsx');
  const productos = ['EA888', 'EA211'];

  const datasets = [];

  productos.forEach(sheet => {
    if (!wb.SheetNames.includes(sheet)) return;
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, defval: '' });
    const dataRows = rows.slice(1); // Ignorar encabezado

    const row = dataRows.find(r => parseInt(r[0], 10) === dia);
    if (!row) return;

    datasets.push({
      label: sheet,
      data: [row[1] ?? 0, row[2] ?? 0, row[3] ?? 0],
      backgroundColor: sheet === 'EA888' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 206, 86, 0.6)',
      borderColor: sheet === 'EA888' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 206, 86, 1)',
      borderWidth: 1
    });
  });

  const ctx = document.getElementById('graficoDesecho').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['T1', 'T2', 'T3'],
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `Desecho del día ${dia} de ${mes.charAt(0).toUpperCase() + mes.slice(1)}`
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 5 }
        }
      }
    }
  });
}
// --- 4.stock (día actual, por turno) ---
async function getStockSemana() {
  const wb = await readExcel('../assets/Archivos/Proceso/stock.xlsx');
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const productos = ['EA888 EVO', 'EA888 BZ', 'EA888 Serie', 'EA211'];

  // Obtener índice del día actual (0 = Lunes, 6 = Domingo)
  const today = new Date();
  const diaSemana = today.getDay(); // 0 = Domingo, 1 = Lunes, ... 6 = Sábado
  // Ajustamos para que 0=Domingo, 1=Lunes,... => Lunes=0, Domingo=6
  const diaIndex = diaSemana === 0 ? 6 : diaSemana - 1;

  productos.forEach((p, i) => {
    const row = rows.find(r => String(r[0]).toLowerCase().includes(p.toLowerCase()));
    if (!row) return;

    const dias = row.slice(1, 8).map(v => v ?? '');

    const fila = document.getElementById(`fila_stock_${i}`);
    if (!fila) return;

    // Limpiamos la fila
    fila.innerHTML = `<td>${p}</td>`;

    dias.forEach((d, idx) => {
      const td = document.createElement('td');
      td.innerText = d;

      // Si es el día actual, ponemos fondo verde claro
      if (idx === diaIndex) {
        td.style.backgroundColor = '#d4edda'; // verde claro
        td.style.fontWeight = '600';
      }

      fila.appendChild(td);
    });
  });
}
  // --- 5. OEE (mes actual) ---
    async function getOeeMesTarjetas() {
      const wb = await readExcel('../assets/Archivos/Proceso/oee.xlsx');
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      const today = new Date();
      const mes = today.toLocaleString('es-ES', { month: 'long' }).trim().toLowerCase();

      const rowEA211 = rows.find(r =>
        r[0].toString().trim().toLowerCase() === mes && r[1].toString().trim() === 'EA211'
      );
      const rowEA888 = rows.find(r =>
        r[0].toString().trim().toLowerCase() === mes && r[1].toString().trim() === 'EA888'
      );

      const oeeEA211 = rowEA211 ? parseFloat(rowEA211[5] ?? 0) : 0;
      const oeeEA888 = rowEA888 ? parseFloat(rowEA888[5] ?? 0) : 0;

      document.getElementById('oee_ea211').innerText = oeeEA211.toFixed(2) + '%';
      document.getElementById('oee_ea888').innerText = oeeEA888.toFixed(2) + '%';
    }


  // --- 6. Dinero Gastado (año actual) ---
    async function actualizarDineroGastado() {
  try {
    const response = await fetch('../assets/Archivos/Finanzas/fpk.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // primera hoja
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    jsonData.shift(); // quitar encabezado

    let totalCosto2025 = 0;
    for(let i=0; i<jsonData.length; i++){
      totalCosto2025 += Number(jsonData[i][1] || 0);
    }

    const valorGastadoDiv = document.getElementById('valor-gastado');
    if(valorGastadoDiv){
      valorGastadoDiv.textContent = totalCosto2025.toLocaleString('en-US') + ' USD';
    }

  } catch (error) {
    console.error("Error al cargar Excel de Finanzas:", error);
  }
}


  // --- Ejecutar ---
  await getAccidentesHoy();
  await getProductividadHoyGrafica();
  await getDesechoHoyGrafica();
  await getStockSemana();
  await getOeeMesTarjetas() ;
  await actualizarDineroGastado() 
})();
