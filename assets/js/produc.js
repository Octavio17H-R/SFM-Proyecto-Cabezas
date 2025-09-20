(function () {
  'use strict';

  const metas = { ea888: 600, ea211: 550 };

  function processExcelData(aoa) {
    const data = [];
    for (let i = 1; i < aoa.length; i++) {
      const row = aoa[i];
      const dia = parseInt(row[0], 10);
      if (isNaN(dia)) continue;

      data.push({
        dia: dia,
        valor: parseFloat(row[1]) || 0
      });
    }
    return data;
  }

  function renderGrafico(id, data) {
    const container = document.getElementById(`chart_${id}`);
    if (!container) return;

    const meta = metas[id];

const options = {
      series: [{ 
        name: id.toUpperCase(), 
        data: data.map(d => d.valor) 
      }],
      chart: { type: 'bar', height: 350, toolbar: { show: false } },
      plotOptions: { 
        bar: { 
          columnWidth: '60%', 
          distributed: false, // desactiva colores por cada barra
          colors: {
            ranges: [],
            backgroundBarColors: [],
            backgroundBarOpacity: 1
          }
        } 
      },
      colors: ['#0B3D91'], // azul oscuro
      dataLabels: { enabled: true, style: { colors: ['#fff'] } },
      xaxis: { categories: data.map(d => d.dia), title: { text: 'Día' } },
      yaxis: { min: 0, max: 700, title: { text: 'Piezas' } },
      annotations: {
        yaxis: [{
          y: metas[id],
          borderColor: '#0B3D91',
          strokeDashArray: 5,
          label: {
            borderColor: '#0B3D91',
            style: { color: '#fff', background: '#0B3D91' },
            text: 'Meta ' + metas[id]
          }
        }]
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: { height: 250 },
          plotOptions: { bar: { columnWidth: '80%' } }
        }
      }]
    };


    container.innerHTML = "";
    const chart = new ApexCharts(container, options);
    chart.render();

    // Tabla debajo del gráfico
    const tabla = document.createElement("table");
    tabla.className = "produccion-table";

    let headerRow = `<tr><th></th>`;
    data.forEach(d => { headerRow += `<th>Día ${d.dia}</th>`; });
    headerRow += `</tr>`;

    let prodRow = `<tr><th>Producción</th>`;
    data.forEach(d => {
      const cumple = d.valor >= meta ? "cumplido" : "no-cumplido";
      prodRow += `<td class="${cumple}">${d.valor}</td>`;
    });
    prodRow += `</tr>`;

    let metaRow = `<tr><th>Meta</th>`;
    data.forEach(() => { metaRow += `<td>${meta}</td>`; });
    metaRow += `</tr>`;

    tabla.innerHTML = `<thead>${headerRow}</thead><tbody>${prodRow}${metaRow}</tbody>`;

    const tablaWrapper = document.createElement("div");
    tablaWrapper.className = "table-responsive";
    tablaWrapper.appendChild(tabla);

    // Insertar tabla debajo de la tarjeta del gráfico
    container.parentNode.appendChild(tablaWrapper);
  }

  async function loadAndRenderCharts() {
    try {
      const response = await fetch('../assets/Archivos/Proceso/productividad.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      ['EA888', 'EA211'].forEach(sheetName => {
        if (workbook.SheetNames.includes(sheetName)) {
          const aoa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });
          const data = processExcelData(aoa);
          renderGrafico(sheetName.toLowerCase(), data);
        }
      });
    } catch (err) {
      console.error(err);
      alert("Error al cargar el Excel. Abre la página desde un servidor local.");
    }
  }

  document.addEventListener('DOMContentLoaded', loadAndRenderCharts);

})();
