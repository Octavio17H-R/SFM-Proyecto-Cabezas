document.addEventListener('DOMContentLoaded', function () {
  const archivoRuta = "../assets/Archivos/oee.xlsx";

  document.getElementById('loadingMessage').style.display = 'block';

  fetch(archivoRuta)
    .then(response => {
      if (!response.ok) throw new Error(`No se pudo cargar el archivo: ${response.statusText}`);
      return response.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Filtrar por línea
      const datosEA211 = jsonData.filter(row => row.Linea === 'EA211');
      const datosEA888 = jsonData.filter(row => row.Linea === 'EA888');

      function crearGrafico(canvasId, datos, titulo) {
        const labels = datos.map(row => row.Fecha);
        const disponibilidad = datos.map(row => row.Disponibilidad);
        const rendimiento = datos.map(row => row.Rendimiento);
        const calidad = datos.map(row => row.Calidad);
        const oee = datos.map(row => row.OEE);

       new Chart(document.getElementById(canvasId).getContext('2d'), {
          type: 'bar', // Cambiamos de 'line' a 'bar'
          data: {
            labels,
              datasets: [
                { label: 'OEE', data: oee, backgroundColor: 'rgba(255, 99, 132, 0.8)', stack: 'Stack 1' },
                { label: 'Disponibilidad', data: disponibilidad, backgroundColor: 'rgba(54, 162, 235, 0.8)', stack: 'Stack 1' },
                { label: 'Rendimiento', data: rendimiento, backgroundColor: 'rgba(75, 192, 192, 0.8)', stack: 'Stack 1' },
                { label: 'Calidad', data: calidad, backgroundColor: 'rgba(255, 159, 64, 0.8)', stack: 'Stack 1' }
              ]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: titulo },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
                  }
                }
              },
              annotation: {
                annotations: {
                  lineaMeta: {
                    type: 'line',
                    yMin: 60,
                    yMax: 60,
                    borderColor: 'red',
                    borderWidth: 2,
                    borderDash: [6, 6],
                    label: {
                      content: 'Meta 60%',
                      enabled: true,
                      position: 'end',
                      backgroundColor: 'rgba(255, 0, 0, 0.7)',
                      color: 'white'
                    }
                  }
                }
              }
            },
            scales: {
              x: { stacked: true, title: { display: true, text: 'Fecha' } },
              y: {
                stacked: true,
                title: { display: true, text: 'Porcentaje (%)' },
                min: 0,
                max: 100,
                ticks: { callback: value => value + '%' }
              }
            }
          }

        });
      }

      crearGrafico('graficoEA211', datosEA211, 'Rendimiento OEE - EA211');
      crearGrafico('graficoEA888', datosEA888, 'Rendimiento OEE - EA888');

      document.getElementById('loadingMessage').style.display = 'none';
    })
    .catch(error => {
      console.error(error);
      document.getElementById('loadingMessage').innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    });
});
