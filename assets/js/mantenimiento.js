// La ruta a tu archivo de Excel
const EXCEL_FILE_PATH = '../assets/Archivos/Finanzas/mantenimiento.xlsx';

// Referencias a los elementos de la tabla en el HTML
const costoRow = document.getElementById('costoRow');
const budgetRow = document.getElementById('budgetRow');
const totalCostoCell = document.getElementById('totalCosto');
const totalBudgetCell = document.getElementById('totalBudget');
const finalAnnualTotalCell = document.getElementById('finalAnnualTotal');
const annualBudgetValue = document.getElementById('annualBudgetValue');
const labels = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

let monthlyChart = null;
let annualChart = null;

// 🔽 Agarro el select de Centro de Costos
const centroCostosSelect = document.getElementById("centroCostos");

// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  // Cargar el primer centro por defecto
  loadExcelAndRender(centroCostosSelect.value);

  // Cambiar cuando el usuario elige otro centro
  centroCostosSelect.addEventListener("change", () => {
    loadExcelAndRender(centroCostosSelect.value);
  });
});

async function loadExcelAndRender(sheetName) {
  try {
    // Carga el archivo de Excel
    const response = await fetch(EXCEL_FILE_PATH);
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    // Busca la hoja según el Centro de Costos
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      alert(`No se encontró la hoja: ${sheetName}`);
      return;
    }

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    jsonData.shift(); // Elimina el encabezado

    const costos = [];
    const budgets = [];
    let totalCosto2025 = 0;
    let totalBudget2025 = 0;

    // Itera sobre los datos del Excel para llenar la tabla y los arrays
    for(let i=0; i<12; i++){
      const row = jsonData[i] || [];
      const costo = Number(row[1]) || 0;
      const budget = Number(row[2]) || 0;
      costos.push(costo);
      budgets.push(budget);
      totalCosto2025 += costo;
      totalBudget2025 += budget;

      // Llenar tabla
      costoRow.cells[i+1].innerHTML = `<input type="number" value="${costo}" readonly>`;
      budgetRow.cells[i+1].innerHTML = `<input type="number" value="${budget}" readonly>`;
    }

    // Actualiza los totales
    totalCostoCell.textContent = totalCosto2025.toLocaleString('en-US');
    totalBudgetCell.textContent = totalBudget2025.toLocaleString('en-US');
    finalAnnualTotalCell.textContent = totalCosto2025.toLocaleString('en-US');
    annualBudgetValue.textContent = totalCosto2025.toLocaleString('en-US') + ' USD';

    // Crea/actualiza los gráficos
    createOrUpdateMonthlyChart(costos, budgets);
    createOrUpdateAnnualChart(totalCosto2025, totalBudget2025);

  } catch (error) {
    console.error("Error cargando Excel o renderizando datos:", error);
  }
}

function createOrUpdateMonthlyChart(costos, budgets){
  const ctx = document.getElementById('monthlyChart').getContext('2d');
  if(monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Costo USD',
          data: costos,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
          label: 'Budget',
          data: budgets,
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 0.7)',
          borderWidth: 2,
          fill: false,
          pointRadius: 3,
          tension: 0.1,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => '$' + v.toLocaleString('en-US')
          }
        }
      }
    }
  });
}

function createOrUpdateAnnualChart(totalCosto2025, totalBudget2025){
  const ctx = document.getElementById('annualChart').getContext('2d');
  if(annualChart) annualChart.destroy();

  // Valores fijos de años anteriores
  const annualData = {
    '2023': 4783598,
    '2024': 3247423,
  };

  const annualLabels = Object.keys(annualData);
  const annualValues = Object.values(annualData);

  // Agrega los datos dinámicos de 2025
  annualLabels.push('2025');
  annualValues.push(totalCosto2025);

  annualChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: annualLabels,
      datasets: [
        {
          label: 'Costo Anual',
          data: annualValues,
          backgroundColor: '#34495e',
          borderRadius: 4
        },
        {
          label: 'Budget 2025',
          data: [null, null, totalBudget2025],
          type: 'line',
          borderColor: '#e74c3c',
          borderWidth: 2,
          fill: false,
          pointRadius: 5,
          pointBackgroundColor: '#e74c3c',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Costo Anual USD',
            font: { size: 14, weight: 'bold' }
          },
          ticks: {
            callback: function(value) {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(value);
            }
          },
          max: 5000000
        }
      }
    }
  });
}
