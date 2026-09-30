# unitTest — API Express + Pruebas Unitarias (UTEQ / GESTDEVOPS)

Proyecto minimalista en **Express** con CRUD de usuarios y **pruebas unitarias** con
**Jest + Supertest**. La capa de datos se mockea para no depender de una DB real.

## Requisitos

- **Node.js 22.x** (verificado con `v22.14.0`)
- **npm 10.x** (verificado con `10.9.2`)

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start          # levanta la API en http://localhost:3000
PORT=4000 npm start # mismo, pero en otro puerto
```

## Pruebas

```bash
npm test           # corre Jest (testEndpoints.js + tests/users.test.js)
npx jest tests/users.test.js --runInBand  # solo la suite extendida
npx jest testEndpoints.js --runInBand      # solo las pruebas originales
```

Resultado esperado: **2 suites, 13 tests en verde**.

## Estructura

```
unitTest/
├── app.js              # app Express (sin listen, exportable para supertest)
├── server.js           # entry point: hace listen (separado para no romper tests)
├── routes/users.js     # endpoints CRUD /api/users
├── services/userService.js  # capa de datos en memoria (mockeada en tests)
├── data/mockUsers.js   # mocks reutilizables (usuarios, payloads válido/inválido)
├── testEndpoints.js    # pruebas originales (POST 201 + POST 400)
├── tests/users.test.js # suite extendida (GET, GET/:id, POST, PUT, DELETE)
├── .husky/             # hooks: pre-commit (lint-staged) + pre-push (tests)
├── .prettierrc.json    # config de formato
├── .prettierignore     # excluidos del formato
└── .gitignore          # excluidos del versionado
```

## Endpoints

| Método | Ruta             | Éxito              | Error                             |
| ------ | ---------------- | ------------------ | --------------------------------- |
| GET    | `/health`        | 200 `{ ok: true }` | —                                 |
| GET    | `/api/users`     | 200 lista          | —                                 |
| GET    | `/api/users/:id` | 200 usuario        | 404 no encontrado                 |
| POST   | `/api/users`     | 201 creado         | 400 si falta `name` o `email`     |
| PUT    | `/api/users/:id` | 200 actualizado    | 400 body vacío, 404 no encontrado |
| DELETE | `/api/users/:id` | 200 eliminado      | 404 no encontrado                 |

Ejemplo:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Carlos","email":"carlos@example.com"}'
```

## Cómo funcionan los tests

- `testEndpoints.js`: verifica `POST /api/users` → 201 con mock de
  `UserService.create`, y 400 si falta el `email`.
- `tests/users.test.js`: cubre los 5 endpoints (casos felices + 400 + 404)
  mockeando `services/userService` con `jest.mock()` y datos de
  `data/mockUsers.js`. `beforeEach(jest.clearAllMocks)` aísla cada test.

## Dependencias

- `express@5.2.1` (única dependencia de producción)
- `jest@29.7.0`, `supertest@7.3.0` (dev, solo para tests)
- `husky@9.1.7`, `lint-staged@16.4.0`, `prettier@3.9.9` (dev, flujo local)

## Flujo local: Husky + lint-staged + Prettier

Regla de oro aplicada: el **pre-commit solo ejecuta tareas rápidas**
(formatear archivos modificados); la **suite completa corre en pre-push**.

| Hook         | Archivo             | Qué hace                                                                                                                          |
| ------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit` | `.husky/pre-commit` | `npx lint-staged` → `prettier --write` solo sobre archivos staged (`*.{js,json,md}` según bloque `lint-staged` en `package.json`) |
| `pre-push`   | `.husky/pre-push`   | `npm test -- --runInBand` (suite Jest completa)                                                                                   |

### Cómo usarlo

```bash
npm install          # el script "prepare" instala los hooks de Husky
npm run format       # formatea todo el proyecto con Prettier
npm run format:check # verifica formato sin modificar (útil en CI)

git add -A && git commit -m "feat: ..."  # pre-commit formatea lo staged
git push                                 # pre-push corre los 13 tests
```

### Notas

1. **Los hooks solo viven si hay repo git**: sin `git init`, Husky no se
   dispara aunque esté instalado. Este proyecto ya es un repo (`main`).
2. **`lint-staged` solo toca lo staged**: a diferencia de `npm run format`
   (todo el proyecto), el pre-commit es rápido porque procesa únicamente
   los archivos del commit.
3. **Si el pre-commit reformatea algo**, `lint-staged` re-agrega los cambios
   al commit automáticamente; revisa con `git status` antes del `push`.
4. **Saltar hooks (solo emergencias)**: `git commit --no-verify` /
   `git push --no-verify`. Evítalo en flujo normal.
5. **`node_modules/`, `coverage/` y `package-lock.json`** están excluidos del
   formato vía `.prettierignore`; `node_modules/` y `coverage/` tampoco se
   versionan (ver `.gitignore`).
6. **La suite hoy tarda <1s**, así que correrla en pre-commit no dolería;
   igual vive en pre-push para blindar la regla cuando crezca (tests de
   integración pesados van a pre-push o CI, nunca a pre-commit).
7. **Al clonar el repo**, basta `npm install` para reactivar los hooks
   (script `prepare` → `husky`).
