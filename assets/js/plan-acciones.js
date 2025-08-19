/* Plan de Acciones - Excel ↔ Tabla (local)
 * Requiere:   ../js/xlsx.full.min.js
 * Lee:        ../data/plan_acciones.xlsx
 * Exporta:    plan_acciones_actualizado.xlsx (descarga)
 * Nota: sirve la página con un servidor local (no abrir como file://).
 */

(function () {
  const RUTA_EXCEL = '../assets/Archivos/Empleado/plan-acciones.xlsx';
  const COLS = ['MES','PROBLEMA','CAUSA','MEDIDA CORRECTIVA','ESCALAR','RESPONSABLE','PLAZO','ESTATUS'];

  const $tbody      = document.getElementById('monthly-data');
  const $btnCargar  = document.getElementById('btn-cargar');
  const $btnGuardar = document.getElementById('btn-guardar');
  const $btnAgregar = document.getElementById('btn-agregar');
  const $btnLimpiar = document.getElementById('btn-limpiar');
  const $selMes     = document.getElementById('mes-select');

  if ($btnCargar)  $btnCargar.addEventListener('click', cargarExcel);
  if ($btnGuardar) $btnGuardar.addEventListener('click', exportarExcel);
  if ($btnAgregar) $btnAgregar.addEventListener('click', () => agregarFila({}));
  if ($btnLimpiar) $btnLimpiar.addEventListener('click', () => { $tbody.innerHTML = ''; $btnGuardar.disabled = false; });
  if ($selMes)     $selMes.addEventListener('change', () => filtrarPorMes($selMes.value));

  function agregarFila(row) {
    const tr = document.createElement('tr');
    COLS.forEach(col => {
      const td = document.createElement('td');
      td.contentEditable = 'true';
      td.dataset.col = col;
      td.textContent = (row[col] ?? '').toString();
      tr.appendChild(td);
    });
    $tbody.appendChild(tr);
  }

  function filtrarPorMes(mes) {
    [...$tbody.querySelectorAll('tr')].forEach(tr => {
      const v = (tr.querySelector('td[data-col="MES"]')?.textContent || '').trim();
      tr.style.display = (mes === 'Todos' || v === mes) ? '' : 'none';
    });
  }

  function leerTablaAOA() {
    const aoa = [COLS];
    [...$tbody.querySelectorAll('tr')].forEach(tr => {
      const fila = COLS.map(c => (tr.querySelector(`td[data-col="${c}"]`)?.textContent || '').trim());
      if (fila.some(v => v !== '')) aoa.push(fila);
    });
    return aoa;
  }

  async function cargarExcel() {
    try {
      const resp = await fetch(RUTA_EXCEL, { cache: 'no-store' });
      if (!resp.ok) throw new Error('No se pudo leer ../data/plan_acciones.xlsx. Usa servidor local y verifica la ruta.');
      const buf = await resp.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });

      const rows = data.map(r => {
        const o = {};
        COLS.forEach(col => {
          const k = Object.keys(r).find(key => key.trim().toLowerCase() === col.toLowerCase());
          o[col] = k ? r[k] : '';
        });
        return o;
      });

      $tbody.innerHTML = '';
      rows.forEach(agregarFila);
      if ($btnGuardar) $btnGuardar.disabled = false;
      if ($selMes) filtrarPorMes($selMes.value || 'Todos');
    } catch (e) {
      alert(e.message);
      console.error(e);
    }
  }

  function exportarExcel() {
    const aoa = leerTablaAOA();
    const ws  = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [
      { wch: 12 }, { wch: 30 }, { wch: 34 }, { wch: 26 },
      { wch: 12 }, { wch: 22 }, { wch: 12 }, { wch: 12 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plan');
    XLSX.writeFile(wb, 'plan_acciones.xlsx');
  }

  // 12 filas vacías iniciales (opcional)
  if ($tbody && !$tbody.children.length) {
    for (let i = 0; i < 12; i++) agregarFila({});
  }
})();
