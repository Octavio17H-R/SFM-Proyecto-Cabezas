/* stock-table.js
   Funcionalidades:
   - Carga automática de Excel desde ruta fija
   - Columna Producto fija (no editable) con 4 filas predeterminadas
   - Solo cargar datos de Excel en columnas de días
   - Exportar Excel
   - Agregar fila editable para días
   - Limpiar tabla
   - CSS exclusivo inyectado automáticamente
*/

(function () {
  const tbody = document.getElementById('monthly-data');
  const btnGuardar = document.getElementById('btn-guardar');
  const btnAgregar = document.getElementById('btn-agregar');
  const btnLimpiar = document.getElementById('btn-limpiar');

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const productosFijos = [
    { nombre: 'EA888 EVO', meta: '2 hrs' },
    { nombre: 'EA888 BZ', meta: '2 hrs' },
    { nombre: 'EA888 Serie', meta: '2 hrs' },
    { nombre: 'EA211', meta: '2 hrs' }
  ];

  // --- Inyectar CSS exclusivo de la tabla ---
  const style = document.createElement('style');
  style.innerHTML = `
    #monthly-data {
      table-layout: fixed;
      width: 100%;
      border-collapse: collapse;
    }
    #monthly-data th, #monthly-data td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: center;
      box-sizing: border-box;
      vertical-align: middle;
    }
    .producto-cell {
      min-width: 150px;
      max-width: 180px;
      white-space: normal;
      word-wrap: break-word;
      text-align: left;
      font-weight: 700;
    }
    .day-cell {
      min-width: 80px;
      text-align: center;
    }
    #monthly-data td[contenteditable="true"] {
      outline: none;
      background-color: #fff;
    }
    .meta-line {
      font-weight: 400;
      font-size: 0.95rem;
      color: #333;
      display: block;
    }
    .shaded td { background: #f5f5f5; }
  `;
  document.head.appendChild(style);

  // --- Helpers ---
  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  function enableSaveIfHasRows() {
    btnGuardar.disabled = tbody.children.length === 0;
  }

  function makeCell(value = '', className = '', editable = true) {
    const td = document.createElement('td');
    if (className) td.className = className;
    td.contentEditable = String(!!editable);
    td.innerText = value === null || value === undefined ? '' : value;
    return td;
  }

  function addRow(productoObj, datosDias = {}) {
    const tr = document.createElement('tr');
    if (tbody.children.length % 2 === 0) tr.classList.add('shaded');

    // Columna Producto fija con nombre + meta
    const tdProd = document.createElement('td');
    tdProd.className = 'producto-cell';
    tdProd.contentEditable = false;
    tdProd.innerHTML = `<div>${escapeHtml(productoObj.nombre)}</div>` +
                       `<div class="meta-line">Meta: ${escapeHtml(productoObj.meta)}</div>`;
    tr.appendChild(tdProd);

    // Columnas de días
    dias.forEach(d => {
      const td = makeCell(datosDias[d] || '', 'day-cell', true);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
    enableSaveIfHasRows();
    return tr;
  }

  function clearTableBody() {
    tbody.innerHTML = '';
    enableSaveIfHasRows();
  }

  // --- Cargar Excel automáticamente ---
  async function cargarExcel() {
    try {
      const resp = await fetch('../assets/Archivos/Proceso/stock.xlsx'); // ruta de tu Excel
      const arrayBuffer = await resp.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      clearTableBody();

      // Solo llenamos columnas de días, Producto permanece fijo
      for (let i = 0; i < productosFijos.length; i++) {
        const rowExcel = rows[i + 1] || []; // +1 si hay header
        const datosDias = {};
        dias.forEach((d, idx) => {
          datosDias[d] = rowExcel[idx + 1] || ''; // columna 0 es Producto, ignoramos
        });
        addRow(productosFijos[i], datosDias);
      }
    } catch (err) {
      console.error('Error cargando Excel:', err);
      // Si falla, inicializamos con filas vacías
      clearTableBody();
      productosFijos.forEach(p => addRow(p));
    }
  }

  // --- Inicializar tabla ---
  cargarExcel();

  // --- Exportar Excel ---
  btnGuardar.addEventListener('click', function () {
    const header = ['Producto'].concat(dias);
    const aoa = [header];
    for (const tr of tbody.children) {
      const cells = Array.from(tr.children).map(td => td.innerText.trim());
      aoa.push(cells.slice(0, 8)); // Producto + 7 días
    }
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'stock_export.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  // --- Agregar fila editable para días ---
  btnAgregar.addEventListener('click', function () {
    addRow({ nombre: 'Nuevo Producto', meta: '' }, {}); 
  });

  // --- Limpiar tabla ---
  btnLimpiar.addEventListener('click', function () {
    if (!confirm('¿Limpiar la tabla? Se eliminarán todas las filas.')) return;
    clearTableBody();
    productosFijos.forEach(p => addRow(p));
  });

  // --- Habilitar botón guardar al editar ---
  tbody.addEventListener('input', function () {
    enableSaveIfHasRows();
  });

})();
