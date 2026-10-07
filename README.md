# Lab9 - CRUD Deportistas Famosos (React + Supabase)

CRUD de un catálogo de deportistas famosos con React (Vite) y Supabase.

## Tabla `deportistas`

| Columna | Tipo |
|---|---|
| id | int8 (PK) |
| created_at | timestamptz |
| nombre | text |
| deporte | text |
| pais | text |
| edad | int4 |
| retirado | bool |

## Ejecutar

1. `npm install`
2. Copiar `.env.example` a `.env` y poner el Project URL y la anon key de Supabase.
3. `npm run dev`
