# Gestión de Base de Datos

Este documento explica cómo usar los endpoints de limpieza y los seeders de datos de demostración.

## 🗑️ Endpoints de Limpieza

### Limpiar toda la base de datos
Elimina todos los datos de todas las tablas.

```bash
DELETE http://localhost:3000/api/database/clean
```

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3000/api/database/clean
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Base de datos limpiada exitosamente. Todas las tablas han sido vaciadas."
}
```

### Resetear base de datos
Limpia la base de datos y prepara para ejecutar seeders.

```bash
POST http://localhost:3000/api/database/reset
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/database/reset
```

## 🌱 Seeders de Datos de Demostración

### Ejecutar todos los seeders

```bash
cd backend
npx sequelize-cli db:seed:all
```

### Ejecutar un seeder específico

```bash
npx sequelize-cli db:seed --seed 20251112000001-demo-users.js
```

### Deshacer todos los seeders

```bash
npx sequelize-cli db:seed:undo:all
```

## 📊 Datos de Demostración Incluidos

### Usuarios (18 usuarios)

#### Superadmin (1)
- **Usuario:** `superadmin`
- **Contraseña:** `admin123`
- **Rol:** Superadmin (0)

#### Empresas (3)
1. **TechCorp Solutions S.L.**
   - Usuario: `techcorp` | Contraseña: `password123`
   
2. **InnovaSoft Digital Agency**
   - Usuario: `innovasoft` | Contraseña: `password123`
   
3. **DataFlow Analytics Inc.**
   - Usuario: `dataflow` | Contraseña: `password123`

#### Gestores (4)
- **TechCorp:** María García (`mgarcia`), Juan Martínez (`jmartinez`)
- **InnovaSoft:** Patricia Jiménez (`pjimenez`)
- **DataFlow:** Elena Ruiz (`eruiz`)

#### Usuarios (10)
- **TechCorp:** Ana López, Carlos Rodríguez, Laura Sánchez, David Moreno
- **InnovaSoft:** Roberto Díaz, Sofía Martín, Jorge González
- **DataFlow:** Miguel Álvarez, Carmen Romero, Francisco Castro

**Contraseña para todos:** `password123`

### Grupos (10 grupos)

#### TechCorp (4 grupos)
1. Desarrollo Frontend
2. Desarrollo Backend
3. DevOps
4. QA Testing

#### InnovaSoft (3 grupos)
5. Diseño UX/UI
6. Marketing Digital
7. Desarrollo Web

#### DataFlow (3 grupos)
8. Data Science
9. Business Intelligence
10. Data Engineering

### Tareas (22 tareas)

Distribuidas en 5 estados:
- **Pendiente (0):** 5 tareas
- **En Progreso (1):** 6 tareas
- **En Revisión (2):** 4 tareas
- **En Testing (3):** 3 tareas
- **Completada (4):** 4 tareas

Las tareas incluyen descripciones realistas de desarrollo, diseño, marketing y análisis de datos.

### Relaciones

- **user_groups:** 25 asignaciones de usuarios a grupos
- **task_users:** 40+ asignaciones de usuarios a tareas

## 🔄 Flujo Completo de Reset

Para resetear completamente la base de datos y cargar datos de demostración:

```bash
# Opción 1: Usando el endpoint
curl -X DELETE http://localhost:3000/api/database/clean
cd backend
npx sequelize-cli db:seed:all

# Opción 2: Usando comandos de Sequelize
cd backend
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:seed:all
```

## ⚠️ Advertencias

- **Los endpoints de limpieza son destructivos** y eliminarán todos los datos permanentemente.
- Se recomienda usar estos endpoints solo en entornos de desarrollo.
- En producción, considera implementar autenticación y autorización para estos endpoints.
- Los datos de seeders son ficticios y están diseñados para demostración y testing.

## 🔒 Seguridad

**IMPORTANTE:** En un entorno de producción, deberías:

1. Proteger estos endpoints con autenticación
2. Limitar el acceso solo a administradores
3. Agregar confirmación adicional antes de ejecutar
4. Registrar todas las operaciones de limpieza en logs
5. Considerar desactivar estos endpoints en producción

Ejemplo de protección (agregar en `routes/database.js`):

```javascript
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.delete('/clean', authMiddleware, isAdmin, databaseController.cleanDatabase);
router.post('/reset', authMiddleware, isAdmin, databaseController.resetDatabase);
```
