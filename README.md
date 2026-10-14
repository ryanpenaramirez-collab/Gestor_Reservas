# GestorReservas · Sistema de gestión de reservas de hotel

Proyecto Integrador de **Entornos de Desarrollo de Software** · Universidad Tecnológica de Pereira
Primera entrega: análisis, modelado y gestión del proyecto.

## Integrante

- Ryan Peña Ramirez

## Descripción

GestorReservas es un sistema web para gestionar las reservas de un hotel pequeño o mediano. Reúne habitaciones, huéspedes, reservas y pagos en un solo lugar, con la disponibilidad siempre al día, para dejar atrás los cuadernos y las hojas de cálculo. Todo se hace desde la página; las confirmaciones y avisos al huésped se envían por mensaje de texto o correo electrónico.

## Problema que resuelve

Cuando las reservas se llevan a mano aparecen dobles reservas, disponibilidad desactualizada y pagos sin registro claro. GestorReservas ordena el proceso y le da al hotel información confiable de ocupación e ingresos.

## Usuarios

| Usuario | Qué hace |
|---|---|
| Huésped | Consulta disponibilidad, reserva, modifica o cancela su reserva |
| Recepcionista | Crea reservas, registra huéspedes, hace check-in y check-out, registra pagos |
| Administrador | Gestiona habitaciones y tarifas y consulta reportes de ocupación e ingresos |

## Funcionalidades principales

1. Gestión de habitaciones y tarifas
2. Consulta de disponibilidad
3. Gestión de reservas (crear, modificar, cancelar)
4. Registro de huéspedes
5. Check-in, check-out y pagos
6. Reportes de ocupación e ingresos

Además, todos los usuarios inician sesión y ven solo lo que su rol permite.

## Arquitectura

El sistema se organiza en **tres capas**. Cada capa solo se comunica con la que tiene al lado.

| Capa | Qué hace | Tecnología propuesta |
|---|---|---|
| Presentación | Pantallas que usa la gente | React |
| Lógica de negocio | Aplica las reglas del hotel (evitar dobles reservas, calcular totales, validar permisos) | Node.js con Express |
| Datos | Guarda y consulta la información | Prisma con base de datos SQL |

Las tecnologías son una propuesta de diseño: en esta primera entrega no se programa el sistema.

## Estructura del repositorio

El repositorio está organizado por capas para facilitar la incorporación futura del
backend y la base de datos. Por ahora solo el **frontend** contiene código implementado.

```
Gestor_Reservas/
├── frontend/   # Presentación (React + Vite + TypeScript)  -> implementado
├── backend/    # Lógica de negocio (Node + Express)         -> pendiente
├── database/   # Datos (Prisma + SQL)                       -> pendiente
├── shared/     # Tipos y utilidades compartidas             -> pendiente
├── package.json          # Scripts raíz del workspace
├── pnpm-workspace.yaml   # Definición del workspace
├── metadata.json
├── .env.example
└── README.md
```

### Paquetes y comandos

El proyecto usa un *workspace* de pnpm. Los comandos se pueden ejecutar desde la raíz:

```bash
pnpm install          # instala dependencias del workspace
pnpm dev              # inicia el frontend
pnpm build            # compila el frontend
pnpm lint             # verifica tipos (tsc)

# Equivalente ejecutando dentro de frontend/
cd frontend && pnpm dev
```

## Modelado

- **Casos de uso:** 9 casos de uso para los tres tipos de usuario.
- **Clases:** `Huesped`, `Reserva`, `Habitacion`, `Pago` y `Usuario`.
- **Secuencia:** proceso de *Realizar una reserva*.

## Documentación

- [Requerimientos](docs/requerimientos.md)
- [Arquitectura](docs/arquitectura.md)
- [Diagrama de casos de uso](docs/diagramas/casos-de-uso.md)
- [Diagrama de clases](docs/diagramas/clases.md)
- [Diagrama de secuencia](docs/diagramas/secuencia.md)

## Control de versiones

El proyecto lo desarrolla una sola persona y trabaja directamente sobre la rama `main`. Cada avance se guarda en un commit con el formato `tipo: descripción corta` (`feat`, `fix`, `docs`, `chore`).

## Estado del proyecto

Primera entrega: análisis y modelado. El sistema aún no está programado ni tiene la base de datos implementada; eso se hará en la entrega final.
