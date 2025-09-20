(function () {
  'use strict';

  const metas = {
    'ea888': { '1er turno': 40, '2do turno': 36, '3er turno': 31 },
    'ea211': { '1er turno': 40, '2do turno': 36, '3er turno': 31 }
  };

  const coloresTurno = ['#008FFB', '#00E396', '#FEB019'];

  function processExcelData(aoa) {
    const data = [];
    for (let i = 1; i < aoa.length; i++) {
      const row = aoa[i];
      const dia = parseInt(row[0], 10);
      if (isNaN(dia) || dia < 1 || dia > 31) continue;

      data.push({
        dia: dia,
        turno1: parseFloat(row[1]) || 0,
        turno2: parseFloat(row[2]) || 0,
        turno3: parseFloat(row[3]) || 0
      });
    }
    return data;
  }

  function renderTurnoGrafico(id, turno, data) {
    const container = document.getElementById(`chart_${id}_${turno}`);
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML = '<p style="text-align:center; color:red;">No hay datos para mostrar</p>';
      return;
    }

    const nombreTurno = turno === 1 ? '1er turno' : turno === 2 ? '2do turno' : '3er turno';
    const series = [{ name: nombreTurno, data: data.map(d => d['turno' + turno]) }];
    const meta = metas[id][nombreTurno];

    const options = {
      series: series,
      chart: { height: 300, type: 'line', toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 2 },
      markers: { size: 4 },
      dataLabels: { enabled: true },
      colors: [coloresTurno[turno - 1]],
      xaxis: {
        categories: data.map(d => d.dia),
        title: { text: 'Día' },
        tickPlacement: 'on'
      },
      yaxis: { min: 0, max: 60, tickAmount: 6, title: { text: 'Piezas' } },
      annotations: {
        yaxis: [
          // Línea de meta
          {
            y: meta,
            borderColor: '#F9C01C',
            
          },
          // Rango rojo por debajo de la meta
          { y: 0, y2: meta, fillColor: '#ef4444', opacity: 0.15, label: { show: false } },
          // Rango verde por encima de la meta
          { y: meta, y2: 60, fillColor: '#22c55e', opacity: 0.15, label: { show: false } }
        ]
      },
      tooltip: { y: { formatter: val => val + ' piezas' } },
      legend: { show: false }
    };

    const chart = new ApexCharts(container, options);
    chart.render();
  }

  async function loadAndRenderCharts() {
    try {
      const response = await fetch('../assets/Archivos/Calidad/Desecho.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      ['EA888', 'EA211'].forEach(sheetName => {
        if (workbook.SheetNames.includes(sheetName)) {
          const aoa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });
          const data = processExcelData(aoa);

          renderTurnoGrafico(sheetName.toLowerCase(), 1, data);
          renderTurnoGrafico(sheetName.toLowerCase(), 2, data);
          renderTurnoGrafico(sheetName.toLowerCase(), 3, data);
        }
      });

    } catch (error) {
      console.error(error);
      alert('Error al cargar el archivo Excel. Abre el HTML desde un servidor local.');
    }
  }

  document.addEventListener('DOMContentLoaded', loadAndRenderCharts);
})();
