async function imprimirProductividadConGraficos() {
    try {
        // Selecciona el contenedor de los gráficos directamente del DOM actual
        const rowSegmento = document.querySelector('.row.g-4');
        if (!rowSegmento) throw new Error('No se encontró el segmento a imprimir');

        // Crear un clon del nodo para no afectar la vista actual
        const cloneRow = rowSegmento.cloneNode(true);

        // Array con todos los gráficos que quieres convertir a imagen
        const charts = [
            { id: 'chart_ea888_1', chartObj: window.chart_ea888_1 },
            { id: 'chart_ea888_2', chartObj: window.chart_ea888_2 },
            { id: 'chart_ea888_3', chartObj: window.chart_ea888_3 },
            { id: 'chart_ea211_1', chartObj: window.chart_ea211_1 },
            { id: 'chart_ea211_2', chartObj: window.chart_ea211_2 },
            { id: 'chart_ea211_3', chartObj: window.chart_ea211_3 }
        ];

        // Convertir cada gráfico a imagen PNG y reemplazar canvas (solo en el clon)
        for (const ch of charts) {
            if (ch.chartObj) {
                const uri = await ch.chartObj.dataURI();
                const img = document.createElement('img');
                img.src = uri.imgURI;
                img.style.width = '100%';
                const chartDiv = cloneRow.querySelector(`#${ch.id}`);
                if (chartDiv) {
                    chartDiv.innerHTML = '';
                    chartDiv.appendChild(img);
                }
            }
        }

        // Abrir ventana de impresión
        const ventana = window.open('', '', 'width=1200,height=900');
        ventana.document.write('<html><head><title>Imprimir Productividad</title>');

        // Mantener tus estilos
        ventana.document.write('<link rel="stylesheet" href="../assets/vendor/css/core.css" />');
        ventana.document.write('<link rel="stylesheet" href="../assets/vendor/css/theme-default.css" />');
        ventana.document.write('<link rel="stylesheet" href="../assets/css/custom.css" />');

        ventana.document.write('</head><body>');
        ventana.document.write(cloneRow.outerHTML);
        ventana.document.write('</body></html>');
        ventana.document.close();
        ventana.print();

    } catch (error) {
        console.error(error);
        alert('Hubo un error al imprimir los gráficos: ' + error.message);
    }
}

// Asignar evento al botón
document.getElementById('btnImprimirProductividad')
    .addEventListener('click', imprimirProductividadConGraficos);
