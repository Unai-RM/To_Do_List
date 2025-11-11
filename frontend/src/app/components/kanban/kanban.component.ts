import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  taskForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
    this.loadTasks();
  }

  initForm(): void {
    this.taskForm = this.fb.group({
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
}
