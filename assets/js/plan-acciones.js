/* Plan de Acciones - Excel ↔ Tabla (con filtros por MES y AREA)
 * Requiere: XLSX (CDN en el HTML)
 * Lee:      ../assets/Archivos/Empleado/plan-acciones.xlsx
 * Exporta:  plan_acciones_actualizado.xlsx
 */

(function () {
  const RUTA_EXCEL = '../assets/Archivos/Empleado/plan-acciones.xlsx';
  // Insertamos AREA después de MES
  const COLS = ['MES','AREA','PROBLEMA','CAUSA','MEDIDA CORRECTIVA','ESCALAR','RESPONSABLE','PLAZO','ESTATUS'];
  const AREAS = ['Empleado','Proceso','Finanzas','Calidad'];
  const STORAGE_KEY = 'plan_acciones_tabla_v2'; // nueva versión por cambio de columnas

  const $tbody      = document.getElementById('monthly-data');
  const $btnCargar  = document.getElementById('btn-cargar');
  const $btnGuardar = document.getElementById('btn-guardar');
  const $btnAgregar = document.getElementById('btn-agregar');
  const $btnLimpiar = document.getElementById('btn-limpiar');
  const $selMes     = document.getElementById('mes-select');
  const $selArea    = document.getElementById('area-select');

  if ($btnCargar)  $btnCargar.addEventListener('click', cargarExcel);
  if ($btnGuardar) $btnGuardar.addEventListener('click', exportarExcel);
  if ($btnAgregar) $btnAgregar.addEventListener('click', () => { agregarFila({}); marcarCambios(); });
  if ($btnLimpiar) $btnLimpiar.addEventListener('click', limpiarTabla);
  if ($selMes)     $selMes.addEventListener('change', aplicarFiltros);
  if ($selArea)    $selArea.addEventListener('change', aplicarFiltros);

  if ($tbody) {
    // Cambios en celdas: normalizamos MES/AREA, re-filtramos y persistimos
    $tbody.addEventListener('input', (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      const td = e.target.closest('td');
      if (!td) return;

      if (td.dataset.col === 'MES') {
        td.textContent = normalizarMes(td.textContent || '');
      }
      if (td.dataset.col === 'AREA') {
        td.textContent = normalizarArea(td.textContent || '');
      }

      marcarCambios();
      guardarLocal();
      aplicarFiltros();
    });
  }

  function marcarCambios() {
    if ($btnGuardar) $btnGuardar.disabled = false;
  }

  function limpiarTabla() {
    if (!$tbody) return;
    $tbody.innerHTML = '';
    if ($btnGuardar) $btnGuardar.disabled = false;
    guardarLocal();
    aplicarFiltros();
  }

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

  function aplicarFiltros() {
    if (!$tbody) return;
    const mesFiltro   = ($selMes?.value || 'Todos').trim();
    const areaFiltro  = ($selArea?.value || 'Todas').trim();

    [...$tbody.querySelectorAll('tr')].forEach(tr => {
      const mes  = (tr.querySelector('td[data-col="MES"]')?.textContent || '').trim();
      const area = (tr.querySelector('td[data-col="AREA"]')?.textContent || '').trim();

      const okMes  = (mesFiltro === 'Todos'  || mes === mesFiltro);
      const okArea = (areaFiltro === 'Todas' || area === areaFiltro);

      tr.style.display = (okMes && okArea) ? '' : 'none';
    });
  }

  function leerTablaAOA() {
    const aoa = [COLS];
    if (!$tbody) return aoa;
    [...$tbody.querySelectorAll('tr')].forEach(tr => {
      const fila = COLS.map(c => (tr.querySelector(`td[data-col="${c}"]`)?.textContent || '').trim());
      if (fila.some(v => v !== '')) aoa.push(fila);
    });
    return aoa;
  }

  async function cargarExcel() {
    try {
      const resp = await fetch(`${RUTA_EXCEL}?_=${Date.now()}`, { cache: 'no-store' });
      if (!resp.ok) throw new Error('No se pudo leer el archivo: ../assets/Archivos/Empleado/plan-acciones.xlsx. Verifica la ruta y usa un servidor local.');
      const buf = await resp.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });

      const rows = data.map(r => {
        const o = {};
        COLS.forEach(col => {
          const k = Object.keys(r).find(key => key.trim().toLowerCase() === col.toLowerCase());
          let val = k ? r[k] : '';
          if (col === 'MES')  val = normalizarMes(val);
          if (col === 'AREA') val = normalizarArea(val);
          o[col] = (val ?? '').toString();
        });
        return o;
      });

      $tbody.innerHTML = '';
      rows.forEach(agregarFila);
      if ($btnGuardar) $btnGuardar.disabled = false;
      guardarLocal();
      aplicarFiltros();
    } catch (e) {
      console.error(e);
      if (!cargarLocal()) {
        alert(e.message);
      } else {
        aplicarFiltros();
      }
    }
  }

  function exportarExcel() {
    const aoa = leerTablaAOA();
    const ws  = XLSX.utils.aoa_to_sheet(aoa);

    const rango = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: Math.max(aoa.length - 1, 0), c: COLS.length - 1 }
    });
    ws['!autofilter'] = { ref: rango };

    ws['!cols'] = [
      { wch: 12 }, // MES
      { wch: 14 }, // AREA
      { wch: 24 }, // PROBLEMA
      { wch: 30 }, // CAUSA
      { wch: 28 }, // MEDIDA CORRECTIVA
      { wch: 12 }, // ESCALAR
      { wch: 20 }, // RESPONSABLE
      { wch: 12 }, // PLAZO
      { wch: 12 }  // ESTATUS
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plan');

    XLSX.writeFile(wb, 'plan_acciones_actualizado.xlsx');
    if ($btnGuardar) $btnGuardar.disabled = true;
  }

  // Normaliza meses: "agosto" -> "Agosto"
  function normalizarMes(m) {
    const t = (m || '').toString().trim().toLowerCase();
    if (!t) return '';
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const idx = meses.indexOf(t);
    const limpio = idx >= 0 ? meses[idx] : t;
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  }

  // Normaliza área a una de las 4 opciones si coincide (case-insensitive)
  function normalizarArea(a) {
    const t = (a || '').toString().trim().toLowerCase();
    if (!t) return '';
    const match = AREAS.find(x => x.toLowerCase() === t);
    return match || (t.charAt(0).toUpperCase() + t.slice(1));
  }

  // Persistencia local
  function guardarLocal() {
    if (!$tbody) return;
    const data = [];
    [...$tbody.querySelectorAll('tr')].forEach(tr => {
      const fila = {};
      COLS.forEach(c => {
        fila[c] = (tr.querySelector(`td[data-col="${c}"]`)?.textContent || '').trim();
      });
      if (Object.values(fila).some(v => v !== '')) data.push(fila);
    });
    const payload = { cols: COLS, rows: data, ts: Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
  }

  function cargarLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const { cols, rows } = JSON.parse(raw);
      if (!Array.isArray(cols) || !Array.isArray(rows)) return false;

      $tbody.innerHTML = '';
      rows.forEach(agregarFila);
      if ($btnGuardar) $btnGuardar.disabled = false;
      return true;
    } catch {
      return false;
    }
  }

  // Inicialización
  (function init() {
    if (!$tbody) return;
    if (!cargarLocal()) {
      for (let i = 0; i < 12; i++) agregarFila({});
    }
    aplicarFiltros();
  })();

})();
