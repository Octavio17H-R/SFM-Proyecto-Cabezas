// graficaKom.js - Adaptado para estructura y mini-gráficos de Kombiblatt

document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.getElementById("cuerpoTabla");
  const canvasProductividad = document.getElementById("miniGraficoProductividad").getContext("2d");
  const canvasOEE = document.getElementById("miniGraficoOEE").getContext("2d");
  const canvasVolumen = document.getElementById("miniGraficoVolumen").getContext("2d");

  const metas = {
    accidentes: 0,
    volumen: { EA888: 1400, EA211: 1100 },
    productividad: 90,
    oee: 63,
    calidad: 95
  };
  const modelos = { EA888: "BZ", EA211: "EA211" };

  let chartProductividad = null;
  let chartOEE = null;
  let chartVolumen = null;

  function calcularSemaforo(real, meta) {
    if (real === null || isNaN(real)) return `<span class="semaforo rojo"></span>`;
    if (real >= meta) return `<span class="semaforo verde"></span>`;
    if (real >= meta * 0.9) return `<span class="semaforo amarillo"></span>`;
    return `<span class="semaforo rojo"></span>`;
  }

  async function leerArchivoXLSX(url, keyValue, area) {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      const fila = json.find(row =>
        row.Producto === area || row.Area === area || row.Nombre === area || row.Modelo === area
      );
      return fila && fila[keyValue] !== undefined ? fila[keyValue] : null;
    } catch {
      return null;
    }
  }

  async function obtenerFilas() {
    const segmentos = [
      { clave: "volumen", archivo: "cumplimiento.xlsx", columna: "Volumen" },
      { clave: "productividad", archivo: "productividad.xlsx", columna: "Productividad" },
      { clave: "oee", archivo: "oee.xlsx", columna: "OEE" },
      { clave: "accidentes", archivo: null, columna: null },
      { clave: "calidad", archivo: null, columna: null },
    ];
    const areas = ["EA888", "EA211"];
    let resultado = [];
    for (let area of areas) {
      let real = {};
      for (let seg of segmentos) {
        if (!seg.archivo) {
          real[seg.clave] = null;
        } else {
          let valor = await leerArchivoXLSX(
            `../assets/Archivos/Proceso/${seg.archivo}`,
            seg.columna,
            area
          );
          real[seg.clave] = valor !== undefined ? valor : null;
        }
      }
      resultado.push({
        area,
        modelo: modelos[area],
        real,
        semaforo: {
          accidentes: "",
          volumen: calcularSemaforo(real.volumen, metas.volumen[area]),
          productividad: calcularSemaforo(real.productividad, metas.productividad),
          oee: calcularSemaforo(real.oee, metas.oee),
          calidad: ""
        }
      });
    }
    return resultado;
  }

  function llenarTabla(filas) {
    tabla.innerHTML = "";
    filas.forEach(fila => {
      tabla.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td>Corazones ${fila.area}</td>
          <td></td>
          <td></td>

          <td>${metas.volumen[fila.area]}</td>
          <td>${fila.semaforo.volumen}</td>
          <td>${fila.real.volumen ?? "N/A"}</td>

          <td>${metas.productividad}</td>
          <td>${fila.semaforo.productividad}</td>
          <td>${fila.real.productividad ?? "N/A"}</td>

          <td>${metas.oee}%</td>
          <td>${fila.semaforo.oee}</td>
          <td>${fila.real.oee ?? "N/A"}</td>

          <td>${fila.modelo}</td>
          <td></td>
          <td></td>

          <td></td>
          <td></td>
          <td></td>
        </tr>`
      );
    });
  }

  function renderMiniChart(ctx, label, data, color, meta) {
    return new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["EA888", "EA211"],
        datasets: [{
          label: label,
          data: data,
          backgroundColor: color
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
          title: meta ? {
            display: true,
            text: `Meta: ${meta}`,
            font: { size: 11 },
            color: '#525252',
            align: 'end'
          } : false,
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(ctx) { return ` ${ctx.parsed.y}`; }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
          y: {
            grid: { display: false },
            beginAtZero: true,
            suggestedMax: label==='OEE' ? 100 : undefined,
            ticks: { font: { size: 11 } },
          }
        }
      }
    });
  }

  // Principal
  const filas = await obtenerFilas();
  llenarTabla(filas);

  // Productividad
  if (chartProductividad) chartProductividad.destroy();
  chartProductividad = renderMiniChart(
    canvasProductividad,
    "Productividad",
    filas.map(f=>Number(f.real.productividad) || 0),
    ["#0068e1", "#0bb183"],
    metas.productividad
  );

  // OEE
  if (chartOEE) chartOEE.destroy();
  chartOEE = renderMiniChart(
    canvasOEE,
    "OEE",
    filas.map(f=>Number(f.real.oee) || 0),
    ["#7755fa", "#e7c200"],
    metas.oee
  );

  // Volumen: gráfico más reducido, al pie
  if (chartVolumen) chartVolumen.destroy();
  chartVolumen = renderMiniChart(
    canvasVolumen,
    "Volumen",
    filas.map(f=>Number(f.real.volumen) || 0),
    ["#22c55e", "#b8bc2c"],
    metas.volumen.EA888 + " / " + metas.volumen.EA211
  );
});
