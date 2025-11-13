# To Do List

Proyecto Full Stack de lista de tareas desarrollado con Angular v15 y Node.js v18.

## 🛠️ Tecnologías

### Frontend
- Angular v15
- TypeScript

### Backend
- Node.js v18
- Express
- Sequelize (ORM)
- MySQL
- Bcrypt (encriptación de contraseñas)

## 📁 Estructura

```
To_Do_List/
├── frontend/           # Aplicación Angular
└── backend/            # API REST Node.js
    ├── config/         # Configuración de base de datos
    ├── migrations/     # Migraciones de Sequelize
    ├── models/         # Modelos de Sequelize
    └── seeders/        # Datos de prueba
```

## 🗄️ Base de Datos

### Tablas:
- **users**: Usuarios del sistema (id, nick, password, name, surname, role)
  - **role**: 0=superadmin, 1=empresa, 2=gestor, 3=usuario (por defecto)
- **tasks**: Tareas (id, title, description, status, id_user_creator)
- **task_users**: Relación many-to-many entre tareas y usuarios
- **groups**: Agrupaciones de usuarios (id, name, description, id_company)
  - **id_company**: Usuario con rol empresa que gestiona el grupo
- **user_groups**: Relación many-to-many entre usuarios y grupos

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd To_Do_List
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

### 3. Crear la base de datos

Desde **phpMyAdmin** o **MySQL CLI**:
```sql
CREATE DATABASE todolist_db;
```

### 4. Ejecutar migraciones

```bash
npx sequelize-cli db:migrate
```

### 5. Ejecutar seeders (datos de demostración)

```bash
npx sequelize-cli db:seed:all
```

**Datos incluidos:**
- 1 Superadmin
- 3 Empresas (TechCorp, InnovaSoft, DataFlow)
- 4 Gestores
- 10 Usuarios
- 10 Grupos de trabajo
- 22 Tareas con diferentes estados
- Relaciones entre usuarios, grupos y tareas

**Credenciales principales:**
- **Superadmin:** `superadmin` / `admin123`
- **Empresas:** `techcorp`, `innovasoft`, `dataflow` / `password123`
- **Todos los demás usuarios:** `password123`

📖 Ver [DATABASE_MANAGEMENT.md](backend/DATABASE_MANAGEMENT.md) para más detalles

### 6. Configurar Frontend

```bash
cd ../frontend
npm install
```

## ▶️ Ejecutar el Proyecto

### Backend (Puerto 3000)
```bash
cd backend
npm start
```

### Frontend (Puerto 4200)
```bash
cd frontend
npm start
```

Abre tu navegador en: `http://localhost:4200`

## 🗄️ Gestión de Base de Datos

### Resetear base de datos (recomendado)
```bash
cd backend
npm run db:reset
```
Este comando limpia la base de datos y recarga todos los seeders automáticamente.

### Limpiar toda la base de datos (sin recargar)
```bash
curl -X DELETE http://localhost:3000/api/database/clean
```

### Recargar solo los seeders
```bash
cd backend
npx sequelize-cli db:seed:all
```

📖 Ver [DATABASE_MANAGEMENT.md](backend/DATABASE_MANAGEMENT.md) para documentación completa

## ✨ Funcionalidades Implementadas

### Autenticación y Roles
- ✅ **Autenticación**: Login y logout con JWT y encriptación de contraseñas
- ✅ **Sistema de roles**: Superadmin (0), Empresa (1), Gestor (2), Usuario (3)
- ✅ **Menú lateral dinámico**: Navegación basada en permisos por rol
- ✅ **Gestión centralizada**: Registro de usuarios solo por superadmin

### Gestión de Tareas
- ✅ **Vista dual**: Alterna entre vista Kanban y tabla de datos
- ✅ **Tablero Kanban**: 5 columnas de estado (Backlog, To Do, Doing, Testing, Done)
- ✅ **Panel de edición lateral**: Sidebar para editar tareas
- ✅ **Edición de estado**: Cambiar estado desde el panel de edición
- ✅ **Usuarios asignados a tareas**:
  - Asignar múltiples gestores y usuarios a cada tarea
  - Visualización con avatares circulares mostrando iniciales
  - Máximo 3 avatares visibles + indicador "+N" para usuarios adicionales
  - Tooltips con nombre completo al hacer hover
  - Gestión desde el panel de edición (agregar/quitar usuarios)
  - Actualización en tiempo real en Kanban y tabla
- ✅ **Soft Delete y Archivado**:
  - Archivar tareas (quedan ocultas pero recuperables)
  - Eliminar tareas con soft delete (no se borran físicamente de la BD)
  - Modal de confirmación personalizado con diseño moderno
  - Botones de acción en tabla y panel de edición
  - Tareas archivadas/eliminadas no aparecen en vistas activas
- ✅ **Filtrado por rol**: Gestores y empresas ven todas las tareas de su compañía
- ✅ **Información detallada**: Creador, fecha de creación y estado de cada tarea

### Gestión de Usuarios
- ✅ **CRUD completo**: Crear, leer, actualizar y eliminar usuarios
- ✅ **Tabla con paginación**: Sistema de paginación con navegación y selector de items por página (5, 10, 15, 20, 25)
- ✅ **Agrupaciones de usuarios**: Sistema de grupos con relación many-to-many

### Configuración y Personalización
- ✅ **Sistema de temas**: 10 gradientes predefinidos para personalizar la apariencia
  - Púrpura Místico, Océano Profundo, Atardecer Cálido, Bosque Esmeralda
  - Fuego Ardiente, Noche Estrellada, Dulce Caramelo, Realeza Dorada
  - Aurora Boreal, Melocotón Suave
- ✅ **Persistencia con cookies**: El tema seleccionado se guarda automáticamente (365 días)
- ✅ **Aplicación global**: El tema se aplica en todos los componentes (Kanban, Login, Register, Users, Settings, Sidebar)
- ✅ **Colores adaptativos**: Texto blanco/negro automático según luminosidad del tema
- ✅ **Transiciones suaves**: Cambios de tema con animaciones de 0.5s
- ✅ **Configuración de usuario**: Editar datos personales (nick, nombre, apellidos)
- ✅ **Cambio de contraseña**: Modal para cambiar contraseña con validaciones de seguridad
- ✅ **Panel dividido**: Configuración de aplicación y configuración de usuario en dos columnas separadas
- ✅ **Validaciones en tiempo real**: Formularios con validación reactiva
- ✅ **Actualización de perfil**: Los cambios se guardan en BD y localStorage

### Interfaz y UX
- ✅ **Modales de confirmación**: Confirmación personalizada para cerrar sesión, archivar y eliminar
- ✅ **Interfaz moderna**: Diseño con gradientes personalizables, animaciones y validaciones reactivas
- ✅ **Estilos consistentes**: Botones, inputs y selectores unificados con tema dinámico
- ✅ **Diseño responsive**: Grid adaptativo en configuración (2 columnas → 1 columna en móvil)
- ✅ **API REST completa**: Endpoints para autenticación, tareas y usuarios

### Accesos por Rol:
- **Superadmin (0)**: Usuarios, Configuración (sin Kanban)
- **Empresa (1)**: Kanban, Usuarios, Configuración
- **Gestor (2)**: Kanban, Usuarios, Configuración
- **Usuario (3)**: Kanban, Configuración (sin Usuarios)

## 🚧 Funcionalidades Pendientes

- [ ] **Gestión de grupos**: Panel para asignar usuarios a grupos
- [ ] **Vista de tareas archivadas**: Sección para ver y recuperar tareas archivadas
- [ ] **Búsqueda y filtros**: Filtrar usuarios/tareas por diferentes criterios
- [ ] **Exportación de datos**: Exportar listados a CSV/Excel
- [ ] **Sistema de notificaciones**: Envío de notificaciones (email/push) cuando se asignan tareas
- [ ] **Foto de perfil**: Permitir subir y gestionar foto de perfil de usuario
- [ ] **Añadir idiomas**: Posibilidad de cambiar de idioma