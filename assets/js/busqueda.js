// Búsqueda inteligente de páginas HTML para dashboard
// Incluir este archivo en cada HTML para que la barra de búsqueda funcione correctamente

document.addEventListener('DOMContentLoaded', function() {
  // Lista de páginas: nombre a buscar -> archivo html
  const htmlPages = [
    { name: 'komiblatt', file: '1-komiblatt.html' },
    { name: 'agenda', file: '2-agenda.html' },
    { name: 'cascada', file: '3-cascada.html' },
    { name: 'accident', file: '4-accident.html' },
    { name: 'ergonomia', file: '6-ergonomia.html' },
    { name: 'plan', file: '7-plan de acciones.html' },
    { name: 'cumplimiento', file: '1-cumplimiento.html' },
    { name: 'oee', file: '2-OEE.html' },
    { name: 'productividad', file: '3-productividad.html' },
    { name: 'stock', file: '4-stock.html' },
    { name: 'fpk', file: '1-fpk.html' },
    { name: 'dañado', file: '2-dañado.html' },
    { name: 'auxiliar', file: '3-auxiliar.html' },
    { name: 'vbz', file: '4-VBZ.html' },
    { name: 'mantenimiento', file: '5-mantenimiento.html' },
    { name: 'auditoria', file: '1-komiblatt.html' }, // Ejemplo para calidad
    { name: 'reclamaciones', file: '2-agenda.html' },
    { name: 'desecho', file: '3-desecho.html' }
  ];
  // Puedes agregar más si tienes más páginas usando esta convención
  function normaliza(str) {
    return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const searchInput = document.querySelector('input[placeholder="Search..."]');
  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const query = normaliza(this.value);
        if (query.length < 2) return; // muy corto para evitar errores
        const found = htmlPages.find(p => normaliza(p.name).includes(query) || query.includes(normaliza(p.name)) );
        if (found) {
          window.location.href = found.file;
        } else {
          alert("No se encontró página para: " + this.value);
        }
      }
    });
  }
});
