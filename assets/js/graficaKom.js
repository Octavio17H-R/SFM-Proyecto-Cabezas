// graficasFinanzas.js

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('fileExcel').addEventListener('change', function(e) {
    const archivo = e.target.files[0];
    const lector = new FileReader();

    lector.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const labels = jsonData.map(row => row.Nombre);
      const valores = jsonData.map(row => row.Valor);

      if (window.graficaFinanzasInstance) {
        window.graficaFinanzasInstance.destroy();
      }

      const ctx = document.getElementById('graficaFinanzas').getContext('2d');
      window.graficaFinanzasInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Costos Mensuales ($)',
            data: valores,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    };

    lector.readAsArrayBuffer(archivo);
  });
});
