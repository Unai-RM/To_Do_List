import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus, TaskColumn } from '../../models/task.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  columns: TaskColumn[] = [
    { name: 'Backlog', status: TaskStatus.BACKLOG, tasks: [] },
    { name: 'To Do', status: TaskStatus.TODO, tasks: [] },
    { name: 'Doing', status: TaskStatus.DOING, tasks: [] },
    { name: 'Testing', status: TaskStatus.TESTING, tasks: [] },
    { name: 'Done', status: TaskStatus.DONE, tasks: [] }
  ];

  showModal: boolean = false;
  showEditModal: boolean = false;
  taskForm!: FormGroup;
  editForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  currentUser: any = null;
  editingTask: Task | null = null;
  viewMode: 'kanban' | 'table' = 'kanban';
  allTasks: Task[] = [];
  
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 15, 20, 25];
  paginatedTasks: Task[] = [];

  // Gestión de usuarios asignados
  selectedUsers: any[] = [];
  availableUsers: any[] = [];
  allCompanyUsers: any[] = [];

  // Modal de confirmación
  showConfirmModal: boolean = false;
  confirmMessage: string = '';
  confirmAction: 'archive' | 'delete' = 'archive';
  confirmCallback: (() => void) | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
    this.initEditForm();
    this.loadTasks();
    this.loadCompanyUsers();
  }

  loadCompanyUsers(): void {
    this.userService.getAllUsers(this.currentUser?.id).subscribe({
      next: (users: any[]) => {
        this.allCompanyUsers = users.filter(u => u.role === 2 || u.role === 3); // Gestores y usuarios
        this.updateAvailableUsers();
      },
      error: (error: any) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  updateAvailableUsers(): void {
    const selectedIds = this.selectedUsers.map(u => u.id);
    this.availableUsers = this.allCompanyUsers.filter(u => !selectedIds.includes(u.id));
  }

  addUser(event: any): void {
    const userId = parseInt(event.target.value);
    console.log('Intentando agregar usuario:', userId);
    console.log('Usuarios disponibles:', this.allCompanyUsers);
    
    if (!userId) return;

    const user = this.allCompanyUsers.find(u => u.id === userId);
    console.log('Usuario encontrado:', user);
    
    if (user && !this.selectedUsers.find(u => u.id === userId)) {
      this.selectedUsers.push(user);
      console.log('Usuario agregado. Seleccionados:', this.selectedUsers);
      this.updateAvailableUsers();
    }
    
    // Reset select
    event.target.value = '';
  }

  removeUser(userId: number): void {
    console.log('Removiendo usuario:', userId);
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== userId);
    console.log('Usuarios restantes:', this.selectedUsers);
    this.updateAvailableUsers();
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  initEditForm(): void {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [0, Validators.required]
    });
  }

  loadTasks(): void {
    if (!this.currentUser || !this.currentUser.id) {
      console.error('No hay usuario autenticado');
      return;
    }

    this.taskService.getTasks(this.currentUser.id).subscribe({
      next: (tasks) => {
        this.distributeTasks(tasks);
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
      }
    });
  }

  distributeTasks(tasks: Task[]): void {
    // Guardar todas las tareas
    this.allTasks = tasks;
    
    // Limpiar columnas
    this.columns.forEach(col => col.tasks = []);
    
    // Distribuir tareas por estado
    tasks.forEach(task => {
      const column = this.columns.find(col => col.status === task.status);
      if (column) {
        column.tasks.push(task);
      }
    });
    
    // Actualizar paginación
    this.updatePagination();
  }

  openModal(): void {
    this.showModal = true;
    this.taskForm.reset();
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.taskForm.reset();
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Debes iniciar sesión para crear tareas';
      return;
    }

    const newTask: Partial<Task> = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description || '',
      status: TaskStatus.BACKLOG,
      id_user_creator: user.id
    };

    this.loading = true;
    this.taskService.createTask(newTask).subscribe({
      next: (task) => {
        this.columns[0].tasks.push(task);
        this.loading = false;
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear tarea:', error);
        this.errorMessage = error.error?.message || 'Error al crear la tarea';
        this.loading = false;
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>, column: TaskColumn): void {
    if (event.previousContainer === event.container) {
      // Mover dentro de la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Mover a otra columna
      const task = event.previousContainer.data[event.previousIndex];
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Actualizar estado en el backend
      this.taskService.updateTaskStatus(task.id, column.status).subscribe({
        next: (updatedTask) => {
          task.status = column.status;
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);
          // Revertir cambio si falla
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          this.errorMessage = 'Error al actualizar el estado de la tarea';
        }
      });
    }
  }

  openEditModal(task: Task): void {
    this.editingTask = task;
    this.editForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status
    });
    
    // Cargar usuarios asignados
    this.selectedUsers = task.assigned_users ? [...task.assigned_users] : [];
    this.updateAvailableUsers();
    
    this.showEditModal = true;
    this.errorMessage = '';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm.reset();
    this.editingTask = null;
    this.errorMessage = '';
  }

  onEditSubmit(): void {
    if (this.editForm.invalid || !this.editingTask) {
      return;
    }

    const updatedTask: Partial<Task> = {
      title: this.editForm.value.title,
      description: this.editForm.value.description || ''
    };

    const oldStatus = this.editingTask.status;
    const newStatus = parseInt(this.editForm.value.status, 10);
    
    console.log('Actualizando tarea:', {
      id: this.editingTask.id,
      oldStatus,
      newStatus,
      statusChanged: oldStatus !== newStatus
    });

    this.loading = true;

    // Actualizar título y descripción
    this.taskService.updateTask(this.editingTask.id, updatedTask).subscribe({
      next: (task) => {
        this.editingTask!.title = task.title;
        this.editingTask!.description = task.description;

        // Si el estado cambió, actualizar también el estado
        if (oldStatus !== newStatus) {
          this.taskService.updateTaskStatus(this.editingTask!.id, newStatus).subscribe({
            next: () => {
              console.log('Estado actualizado en backend, moviendo tarea...');
              
              // Guardar referencia a la tarea antes de moverla
              const taskToMove = this.editingTask!;
              
              // Remover la tarea de la columna anterior
              const oldColumn = this.columns.find(col => col.status === oldStatus);
              if (oldColumn) {
                const taskIndex = oldColumn.tasks.findIndex(t => t.id === taskToMove.id);
                if (taskIndex > -1) {
                  console.log(`Removiendo tarea de columna ${oldColumn.name}`);
                  oldColumn.tasks.splice(taskIndex, 1);
                }
              }

              // Actualizar el estado de la tarea
              taskToMove.status = newStatus;
              taskToMove.title = task.title;
              taskToMove.description = task.description;

              // Agregar la tarea a la nueva columna
              const newColumn = this.columns.find(col => col.status === newStatus);
              if (newColumn) {
                console.log(`Agregando tarea a columna ${newColumn.name}`);
                newColumn.tasks.push(taskToMove);
              }

              // Actualizar también en allTasks
              const taskInAllTasks = this.allTasks.find(t => t.id === taskToMove.id);
              if (taskInAllTasks) {
                taskInAllTasks.status = newStatus;
                taskInAllTasks.title = task.title;
                taskInAllTasks.description = task.description;
              }

              // Actualizar usuarios asignados
              const userIds = this.selectedUsers.map(u => u.id);
              this.taskService.updateTaskUsers(this.editingTask!.id, userIds).subscribe({
                next: () => {
                  console.log('Usuarios actualizados correctamente');
                  taskToMove.assigned_users = [...this.selectedUsers];
                  
                  // Actualizar en allTasks
                  if (taskInAllTasks) {
                    taskInAllTasks.assigned_users = [...this.selectedUsers];
                  }
                  
                  this.updatePagination();
                  this.loading = false;
                  this.closeEditModal();
                },
                error: (error) => {
                  console.error('Error al actualizar usuarios:', error);
                  this.updatePagination();
                  this.loading = false;
                  this.closeEditModal();
                }
              });
            },
            error: (error) => {
              console.error('Error al actualizar estado:', error);
              this.errorMessage = 'Error al actualizar el estado de la tarea';
              this.loading = false;
            }
          });
        } else {
          // Si no cambió el estado, solo actualizar título, descripción y usuarios
          this.editingTask!.title = task.title;
          this.editingTask!.description = task.description;
          
          // Actualizar también en allTasks
          const taskInAllTasks = this.allTasks.find(t => t.id === this.editingTask!.id);
          if (taskInAllTasks) {
            taskInAllTasks.title = task.title;
            taskInAllTasks.description = task.description;
          }
          
          // Actualizar usuarios asignados
          const userIds = this.selectedUsers.map(u => u.id);
          this.taskService.updateTaskUsers(this.editingTask!.id, userIds).subscribe({
            next: () => {
              console.log('Usuarios actualizados correctamente');
              this.editingTask!.assigned_users = [...this.selectedUsers];
              
              if (taskInAllTasks) {
                taskInAllTasks.assigned_users = [...this.selectedUsers];
              }
              
              this.updatePagination();
              this.loading = false;
              this.closeEditModal();
            },
            error: (error) => {
              console.error('Error al actualizar usuarios:', error);
              this.updatePagination();
              this.loading = false;
              this.closeEditModal();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error al actualizar tarea:', error);
        this.errorMessage = error.error?.message || 'Error al actualizar la tarea';
        this.loading = false;
      }
    });
  }

  getColumnIds(): string[] {
    return this.columns.map((_, index) => `column-${index}`);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Comparar solo las fechas (sin horas)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = nowOnly.getTime() - dateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  }

  setViewMode(mode: 'kanban' | 'table'): void {
    this.viewMode = mode;
  }

  getStatusName(status: TaskStatus): string {
    const statusNames: { [key: number]: string } = {
      [TaskStatus.BACKLOG]: 'Backlog',
      [TaskStatus.TODO]: 'To Do',
      [TaskStatus.DOING]: 'Doing',
      [TaskStatus.TESTING]: 'Testing',
      [TaskStatus.DONE]: 'Done'
    };
    return statusNames[status] || 'Desconocido';
  }

  getInitials(name: string, surname: string): string {
    const firstInitial = name ? name.charAt(0).toUpperCase() : '';
    const lastInitial = surname ? surname.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }

  onArchiveTask(task: Task): void {
    this.showConfirm(
      `¿Estás seguro de que deseas archivar la tarea "${task.title}"?`,
      'archive',
      () => {
        this.taskService.archiveTask(task.id).subscribe({
          next: () => {
            this.removeTaskFromView(task.id);
          },
          error: (error: any) => {
            console.error('Error al archivar tarea:', error);
            alert('Error al archivar la tarea');
          }
        });
      }
    );
  }

  onDeleteTask(task: Task): void {
    this.showConfirm(
      `¿Estás seguro de que deseas eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`,
      'delete',
      () => {
        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            this.removeTaskFromView(task.id);
          },
          error: (error: any) => {
            console.error('Error al eliminar tarea:', error);
            alert('Error al eliminar la tarea');
          }
        });
      }
    );
  }

  onArchiveTaskFromSidebar(): void {
    if (this.editingTask) {
      this.showConfirm(
        `¿Estás seguro de que deseas archivar la tarea "${this.editingTask.title}"?`,
        'archive',
        () => {
          this.taskService.archiveTask(this.editingTask!.id).subscribe({
            next: () => {
              this.removeTaskFromView(this.editingTask!.id);
              this.closeEditModal();
            },
            error: (error: any) => {
              console.error('Error al archivar tarea:', error);
              alert('Error al archivar la tarea');
            }
          });
        }
      );
    }
  }

  onDeleteTaskFromSidebar(): void {
    if (this.editingTask) {
      this.showConfirm(
        `¿Estás seguro de que deseas eliminar la tarea "${this.editingTask.title}"? Esta acción no se puede deshacer.`,
        'delete',
        () => {
          this.taskService.deleteTask(this.editingTask!.id).subscribe({
            next: () => {
              this.removeTaskFromView(this.editingTask!.id);
              this.closeEditModal();
            },
            error: (error: any) => {
              console.error('Error al eliminar tarea:', error);
              alert('Error al eliminar la tarea');
            }
          });
        }
      );
    }
  }

  showConfirm(message: string, action: 'archive' | 'delete', callback: () => void): void {
    this.confirmMessage = message;
    this.confirmAction = action;
    this.confirmCallback = callback;
    this.showConfirmModal = true;
  }

  executeConfirm(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.cancelConfirm();
  }

  cancelConfirm(): void {
    this.showConfirmModal = false;
    this.confirmMessage = '';
    this.confirmCallback = null;
  }

  private removeTaskFromView(taskId: number): void {
    // Remover de las columnas del Kanban
    this.columns.forEach(column => {
      column.tasks = column.tasks.filter(t => t.id !== taskId);
    });

    // Remover de allTasks
    this.allTasks = this.allTasks.filter(t => t.id !== taskId);
    
    // Actualizar paginación
    this.updatePagination();
  }

  // Métodos de paginación
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTasks = this.allTasks.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.allTasks.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.updatePagination();
  }

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get editTitle() { return this.editForm.get('title'); }
  get editDescription() { return this.editForm.get('description'); }
}
