import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus, TaskColumn } from '../../models/task.model';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
    this.initEditForm();
    this.loadTasks();
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
      description: ['']
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
    // Limpiar columnas
    this.columns.forEach(col => col.tasks = []);
    
    // Distribuir tareas por estado
    tasks.forEach(task => {
      const column = this.columns.find(col => col.status === task.status);
      if (column) {
        column.tasks.push(task);
      }
    });
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
      description: task.description
    });
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

    this.loading = true;
    this.taskService.updateTask(this.editingTask.id, updatedTask).subscribe({
      next: (task) => {
        // Actualizar la tarea en la columna correspondiente
        this.editingTask!.title = task.title;
        this.editingTask!.description = task.description;
        this.loading = false;
        this.closeEditModal();
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

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get editTitle() { return this.editForm.get('title'); }
  get editDescription() { return this.editForm.get('description'); }
}
