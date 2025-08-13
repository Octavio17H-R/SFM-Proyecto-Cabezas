<p align="center">
<img src="/SFM Proyecto/img/FON.PNG" alt="Proyecto SFM" width="80px">
</p>

<h1 align="center">
   Proyecto Web SFM - Fundición Volkswagen de México
</h1>

<p align="center">
   Dashboard web responsivo desarrollado en HTML5, Bootstrap 5 y JavaScript para el seguimiento de indicadores <b>SFM</b> (shopfloor management) y <b>OEE</b> (Overall Equipment Effectiveness) en el área de Fundición de Volkswagen de México.
</p>
---

## 📌 Introducción 🚀

Este proyecto integra un **dashboard interactivo** para la visualización y análisis de datos de producción y seguridad, directamente extraídos de archivos Excel, eliminando la necesidad de carga manual.

Diseñado para:
- **Monitorear métricas clave** de SFM y OEE en tiempo real.
- **Generar gráficos dinámicos** con Chart.js (barras, líneas, apilados).
- **Automatizar la carga de datos** desde reportes de producción en Excel.
- Mantener un diseño **100% responsivo** adaptable a cualquier dispositivo.
- Integrar **Bootstrap 5 (Sneat Template)** con personalizaciones y Tailwind CSS.

---

## 🚀 Funcionalidades principales

- **Carga automática de datos** desde archivos Excel.
- **Gráficos OEE** con disponibilidad, rendimiento y calidad.
- **Indicadores SFM** filtrables por día, mes, tipo, área y estatus.
- **Líneas de meta** configurables en los gráficos.
- **Diseño responsivo** optimizado para escritorio, tablet y móvil.
- **Interfaz intuitiva** para personal de producción.

---

## 🛠️ Tecnologías utilizadas

- **HTML5 / CSS3 / JavaScript**
- **Bootstrap 5** (basado en plantilla Sneat)
- **Tailwind CSS** (estilos adicionales)
- **Chart.js** (visualización de datos)
- **SheetJS (XLSX.js)** para lectura de Excel
- **Node.js / Gulp** para compilación y optimización (opcional)

---

## 📂 Estructura del proyecto

/assets
/css → Estilos personalizados
/js → Scripts de carga y gráficos
/Archivos → Reportes Excel (fuente de datos)
/img → Imágenes y logos

index.html → Dashboard principal
sfm.html → Vista dedicada a indicadores SFM
oee.html → Vista dedicada a indicadores OEE

yaml
Copiar
Editar

---

## ⚙️ Instalación y uso

1. Clonar este repositorio:
   ```bash
   git clone https://github.com/octaviohernandez/SFM Poryecto.git
Colocar los reportes Excel en la carpeta /assets/Archivos/.

Abrir index.html en el navegador.

(Opcional) Ejecutar con Node.js y Gulp para compilación y live-reload:

bash
Copiar
Editar
npm install
npm run serve
📊 Ejemplo de dashboard

📅 Roadmap
 Integración de lectura automática de Excel.

 Visualización OEE con línea de meta.

 Filtros dinámicos SFM.

 Exportación de datos filtrados.

 Panel de administración para carga de archivos.

📄 Licencia
Este proyecto es de uso interno para Volkswagen de México.
No está autorizado su uso o distribución fuera de la organización sin permiso.

✍️ Autor
Octavio Hernández
Desarrollador Frontend & Analista de Datos
📧 octavio.her1707@gmail.com

💡 Nota: Este proyecto fue desarrollado inicialmente sobre la plantilla Sneat Bootstrap 5 HTML Admin Template, pero ha sido completamente adaptado y personalizado para los requerimientos de la Nave 10 - Área de Fundición.
