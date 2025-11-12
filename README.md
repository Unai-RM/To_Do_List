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

### 5. Ejecutar seeders (crear superadmin)

```bash
npx sequelize-cli db:seed:all
```

**Credenciales del superadmin:**
- Usuario: `superadmin`
- Contraseña: `admin123`

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

## ✨ Funcionalidades Implementadas

- ✅ **Autenticación**: Login y logout con JWT y encriptación de contraseñas
- ✅ **Sistema de roles**: Superadmin (0), Empresa (1), Gestor (2), Usuario (3)
- ✅ **Menú lateral dinámico**: Navegación basada en permisos por rol
- ✅ **Gestión centralizada**: Registro de usuarios solo por superadmin
- ✅ **Agrupaciones de usuarios**: Sistema de grupos con relación many-to-many
- ✅ **Tablero Kanban**: 5 columnas de estado (para empresa y gestor)
- ✅ **Gestión de tareas**: Crear, editar y mover tareas con drag & drop
- ✅ **Filtrado por usuario**: Cada usuario ve solo sus propias tareas
- ✅ **Modal de confirmación**: Confirmación antes de cerrar sesión
- ✅ **Interfaz moderna**: Diseño con gradientes, modales animados y validaciones reactivas
- ✅ **API REST completa**: Endpoints para autenticación y gestión de tareas
- ✅ **Paginación de datatable**: Sistema de paginación con navegación y selector de items por página (5, 10, 25, 50, 100)

### Accesos por Rol:
- **Superadmin (0)**: Usuarios, Configuración (sin Kanban)
- **Empresa (1)**: Kanban, Usuarios, Configuración
- **Gestor (2)**: Kanban, Usuarios, Configuración
- **Usuario (3)**: Kanban, Configuración (sin Usuarios)

## 🚧 Funcionalidades Pendientes

- [ ] **Asignar usuarios a tareas**: Compartir tareas entre múltiples usuarios
- [ ] **Gestión de grupos**: Panel para asignar usuarios a grupos
- [ ] **Eliminar tareas**: Botón y endpoint para eliminar
- [ ] **Diseño responsive**: Adaptar para móviles y tablets
- [ ] **Mejoras de estilo**: Tema oscuro/claro, notificaciones toast, animaciones mejoradas
- [ ] **Búsqueda y filtros**: Filtrar usuarios/tareas por diferentes criterios
- [ ] **Exportación de datos**: Exportar listados a CSV/Excel
