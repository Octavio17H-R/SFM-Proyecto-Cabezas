(function(){
  'use strict';

  const COLORS = { green: '#22c55e', red: '#ef4444', weekend: '#dddddd', none: '' };

  function generarGrid(gridBody){
    gridBody.innerHTML = '';
    for(let y=42; y>=8; y-=2){
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = y;
      th.style.background = '#f8fafc';
      th.style.position = 'sticky';
      th.style.left = '0';
      th.style.zIndex = '2';
      tr.appendChild(th);
      for(let d=1; d<=31; d++){
        const td = document.createElement('td');
        td.dataset.dia = d;
        td.dataset.valor = y;
        td.style.cursor = 'pointer';
        td.style.padding = '6px';
        td.style.width = '30px';
        td.style.height = '22px';
        td.style.border = '1px dotted #333';
        tr.appendChild(td);
      }
      gridBody.appendChild(tr);
    }
  }

  function setCellState(td, state){
    td.setAttribute('data-state', state);
    if(state === 'green') td.style.background = COLORS.green;
    else if(state === 'red') td.style.background = COLORS.red;
    else if(state === 'weekend') td.style.background = COLORS.weekend;
    else td.style.background = '';
  }

  function normalizeCellValue(v){
    if(v === null || typeof v === 'undefined') return 'none';
    v = String(v).trim().toLowerCase();
    if(!v) return 'none';
    const greenWords = ['verde','green','ok','1','si','v'];
    const redWords = ['rojo','red','fuera','out','0','no','f'];
    const weekendWords = ['sabado','sábado','saturday','domingo','sunday','sat','sun','weekend'];
    if(greenWords.includes(v)) return 'green';
    if(redWords.includes(v)) return 'red';
    if(weekendWords.includes(v)) return 'weekend';
    return 'none';
  }

function applyAoAToGrid(gridBody, aoa){
  if(!Array.isArray(aoa) || aoa.length <= 1) return; // <=1 para saltar encabezado
  const filas = aoa.slice(1).filter(r => Array.isArray(r) && r.some(c => String(c).trim() !== ''));
  filas.forEach((row,rIdx)=>{
    const y = 42 - (rIdx*2);
    const tr = Array.from(gridBody.querySelectorAll('tr'))
      .find(t => t.querySelector('th') && Number(t.querySelector('th').textContent) === y);
    if(!tr) return;
    for(let c=0;c<31;c++){
      const td = tr.querySelector(`td[data-dia="${c+1}"]`);
      const raw = row[c+1] !== undefined ? row[c+1] : '';
      setCellState(td, normalizeCellValue(raw));
    }
  });
}


  function exportGridToAoA(gridBody){
    const rows = [];
    const trs = Array.from(gridBody.querySelectorAll('tr'));
    trs.forEach(tr=>{
      const label = tr.querySelector('th').textContent;
      const row = [label];
      tr.querySelectorAll('td').forEach(td=>{
        const s = td.getAttribute('data-state') || 'none';
        if(s==='green') row.push('verde');
        else if(s==='red') row.push('rojo');
        else if(s==='weekend') row.push('fin_semana');
        else row.push('');
      });
      rows.push(row);
    });
    const header = ['Piezas/Día', ...Array.from({length:31},(_,i)=>i+1)];
    rows.unshift(header);
    return rows;
  }

  function initProductividad(id){
    const table = document.getElementById(`productividadTable_${id}`);
    const gridBody = document.getElementById(`gridBody_${id}`);
    generarGrid(gridBody);

    table.addEventListener('click', e=>{
      if(e.target.tagName !== 'TD') return;
      const td = e.target;
      const order = ['none','green','red'];
      let idx = order.indexOf(td.getAttribute('data-state')||'none');
      setCellState(td, order[(idx+1)%order.length]);
    });
  }

  function downloadBothTables(){
    const aoa1 = exportGridToAoA(document.getElementById('gridBody_ea888'));
    const aoa2 = exportGridToAoA(document.getElementById('gridBody_ea211'));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa1), 'EA888');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa2), 'EA211');
    XLSX.writeFile(wb,'productividad.xlsx');
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    ['ea888','ea211'].forEach(initProductividad);

    const btnGuardar = document.createElement('button');
    btnGuardar.textContent = 'Descargar';
    btnGuardar.className = 'btn btn-success mb-4';
    btnGuardar.onclick = downloadBothTables;
    document.querySelector('.container.py-4').prepend(btnGuardar);

    // Auto-load del excel local
    fetch('../assets/Archivos/Proceso/productividad.xlsx')
      .then(resp=>resp.arrayBuffer())
      .then(ab=>{
        const wb = XLSX.read(new Uint8Array(ab),{type:'array'});
        if(wb.SheetNames.includes('EA888')){
          const aoa1 = XLSX.utils.sheet_to_json(wb.Sheets['EA888'],{header:1,defval:''});
          applyAoAToGrid(document.getElementById('gridBody_ea888'), aoa1);
        }
        if(wb.SheetNames.includes('EA211')){
          const aoa2 = XLSX.utils.sheet_to_json(wb.Sheets['EA211'],{header:1,defval:''});
          applyAoAToGrid(document.getElementById('gridBody_ea211'), aoa2);
        }
      })
      .catch(err=>console.warn('No se pudo cargar productividad_doble.xlsx',err));
  });
})();
