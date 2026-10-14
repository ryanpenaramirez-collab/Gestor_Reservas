# Backend

Capa de **lógica de negocio** (API/servicios). Aún no implementada.

Aquí vivirá el servidor que aplica las reglas del hotel (evitar dobles reservas,
calcular totales, validar permisos por rol) y expone los endpoints que consume el
frontend.

Tecnología propuesta: Node.js con Express.

Contenido pendiente de agregar en una entrega futura:
- Rutas/controladores de la API
- Servicios y reglas de negocio
- Autenticación y autorización por rol
- Conexión a la capa de datos

Nota: cuando se cree, agregar un `package.json` con nombre `backend` e incluir
la carpeta en `pnpm-workspace.yaml`.
