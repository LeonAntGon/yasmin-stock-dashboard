Lencería Yas - Dashboard de Análisis de Productos
Una aplicación web moderna y completa diseñada para analizar el rendimiento de productos de lencería. Permite a los emprendedores tomar decisiones inteligentes basadas en datos reales, visualizando métricas clave como rentabilidad, inversión, y recuperación.

🚀 Características Principales
Conexión segura: Se conecta a Google Sheets usando variables de entorno para proteger tus credenciales.

Análisis de rentabilidad: Calcula automáticamente el profit margin, los costos totales y los ingresos.

Tracking de inversión: Visualiza la relación entre el dinero invertido y el dinero recuperado.

Dashboard interactivo:

Cards de resumen: Vistazo rápido a las métricas más importantes.

Gráficos: Representaciones visuales de productos top y distribución.

Tabla con filtros avanzados: Explora tus datos en detalle.

Parsing inteligente: Maneja automáticamente datos con formatos variables y "sucios" para una carga sin problemas.

Exportación de datos: Exporta los datos filtrados en formato CSV.

Diseño responsive: Optimizado para una experiencia fluida tanto en dispositivos móviles como en desktop.

Manejo robusto de errores: Alertas visuales que señalan problemas en los datos de origen.

🔒 Configuración de Seguridad
Para una conexión segura a tu Google Sheet, crea un archivo llamado .env en la raíz de tu proyecto con el siguiente contenido:

VITE_GOOGLE_SHEET_ID=tu_sheet_id_aqui

Importante: Por tu seguridad, no subas el archivo .env a repositorios públicos.

📊 Formato del Google Sheet
La aplicación espera que los datos en tu hoja de cálculo sigan esta estructura. El nombre de las columnas debe ser exactamente el siguiente para que el parsing funcione correctamente:

-Producto en 1A

-Costo 2A

-PrecioVenta en 3A

-CantidadVendida en 4A

-CantidadComprada en 5A


Notas:

Costo: El precio de compra del producto.

PrecioVenta: El precio al que se vende el producto.

CantidadVendida: Puede ser un número ("2"), un rango ("1+"), un guión ("2-3"), o estar vacío (se asume 1).

CantidadComprada: El número total de unidades compradas (este campo es obligatorio).

🛠 Instalación Local
# 1. Clonar el repositorio
git clone [tu-repo-url]
cd lenceria-yas

# 2. Configurar variables de entorno
cp .env.example .env
# Luego, edita el archivo .env con tu SHEET_ID

# 3. Instalar las dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Compilar para producción
npm run build

📋 Uso
Actualizar Datos: Haz clic en el botón "Actualizar Datos" para sincronizar la información más reciente de tu Google Sheet.

Analizar Resultados:

Usa las cards de resumen para obtener métricas clave.

Revisa los gráficos para identificar tus productos más exitosos.

Interactúa con la tabla para ordenar y filtrar por producto, rentabilidad, etc.

Exportar Datos: Exporta los datos filtrados a un archivo CSV para análisis externos.

Manejo de Errores:

Las filas que muestran el ícono ⚠️ tienen problemas de formato.

Revisa el panel de errores para obtener más detalles y corregir tu Google Sheet.

🎯 Métricas Calculadas
Inversión Total: Costo × Unidades compradas

Costo Total: Costo × Unidades vendidas

Ingresos: PrecioVenta × Unidades vendidas

Ganancia: Ingresos - Costo Total

% Recuperación: (Ingresos ÷ Inversión Total) × 100

Inventario Restante: Compradas - Vendidas

Valor Inventario: Inventario Restante × Costo

🔧 Tecnologías
React 18 + TypeScript: Para una interfaz de usuario moderna y robusta.

Tailwind CSS: Para un diseño rápido, responsivo y personalizable.

Recharts: Para la creación de gráficos interactivos.

PapaParse: Para el análisis eficiente de datos CSV.

Vite: Para un entorno de desarrollo rápido.

Variables de entorno: Para la gestión segura de las configuraciones.

📱 UX
Búsqueda instantánea por nombre de producto.

Ordenamiento por columna en la tabla.

Paginación configurable para manejar grandes volúmenes de datos.

Resaltado visual para identificar rápidamente la rentabilidad.

Tooltips informativos para detalles de errores.

Actualización automática de datos al cargar la página.

Exportación simple a CSV.

🐛 Manejo de Errores
El dashboard incluye validaciones robustas para manejar:

Problemas de conectividad con Google Sheets.

Datos faltantes o inválidos en las columnas clave.

Formatos de números inconsistentes.

Hojas de cálculo vacías o malformadas.

Cantidades vendidas o compradas con valores no numéricos.

Variables de entorno faltantes o mal configuradas.

🚀 Deploy
Esta aplicación está optimizada para ser desplegada en plataformas de hosting estático:

Netlify

Vercel

GitHub Pages

Cualquier otro hosting de archivos estáticos

Simplemente ejecuta npm run build y sube los archivos compilados de la carpeta /dist. Recuerda configurar las variables de entorno en la plataforma de despliegue.

💡 Tips de Uso
Consistencia: Mantén los nombres de productos consistentes en tu hoja de cálculo para un mejor seguimiento.

Actualización: Sincroniza los datos regularmente para tener la información más precisa.

Análisis: Usa los filtros para identificar productos de baja rentabilidad y tomar medidas.

Backups: Exporta tus datos a CSV antes de realizar cambios importantes.

Monitoreo: Presta especial atención al % de recuperación para detectar productos que no están generando ingresos.

📈 Roadmap Futuro
Comparación de períodos (ej. mes actual vs. mes anterior).

Alertas automáticas de rentabilidad baja.

Proyecciones de ventas basadas en el histórico.

Integración con redes sociales para analizar el rendimiento de productos promocionados.

Dashboard de tendencias temporales.

🤝 Soporte
Si tienes algún problema, puedes:

Hacer clic en "Actualizar Datos" para un reintento.

Revisar la consola del navegador en busca de errores.

Asegurarte de que los datos en tu Google Sheet son válidos.

Verificar la configuración de tu archivo .env.

¡Hecho con ❤️ para emprendedoras que quieren hacer crecer su negocio de lencería!
