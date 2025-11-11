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
- **users**: Usuarios del sistema (id, nick, password, name, surname)
- **tasks**: Tareas (id, title, description, status, id_user_creator)
- **task_users**: Relación many-to-many entre tareas y usuarios

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

### 5. Configurar Frontend

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

- ✅ **Autenticación**: Registro, login y logout con JWT y encriptación de contraseñas
- ✅ **Tablero Kanban**: 5 columnas de estado (Backlog, To Do, Doing, Testing, Done)
- ✅ **Gestión de tareas**: Crear, editar y mover tareas con drag & drop
- ✅ **Filtrado por usuario**: Cada usuario ve solo sus propias tareas
- ✅ **Interfaz moderna**: Diseño con gradientes, modales animados y validaciones reactivas
- ✅ **API REST completa**: Endpoints para autenticación y gestión de tareas

## 🚧 Funcionalidades Pendientes

- [ ] **Asignar usuarios a tareas**: Compartir tareas entre múltiples usuarios
- [ ] **Eliminar tareas**: Botón y endpoint para eliminar
- [ ] **Diseño responsive**: Adaptar para móviles y tablets
- [ ] **Mejoras de estilo**: Tema oscuro/claro, notificaciones toast, animaciones mejoradas

### Estructura de Estados de Tareas
Los estados se manejan como números enteros:
- `0` = Backlog
- `1` = To Do
- `2` = Doing
- `3` = Testing
- `4` = Done
