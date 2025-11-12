import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todas las tareas del usuario
  getTasks(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?userId=${userId}`, { headers: this.getHeaders() });
  }

  // Crear tarea
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { headers: this.getHeaders() });
  }

  // Actualizar tarea completa
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  // Actualizar solo el estado de la tarea
  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  // Actualizar usuarios asignados a una tarea
  updateTaskUsers(id: number, userIds: number[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/users`, { userIds }, { headers: this.getHeaders() });
  }

  // Archivar tarea
  archiveTask(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/archive`, {}, { headers: this.getHeaders() });
  }

  // Desarchivar tarea
  unarchiveTask(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/unarchive`, {}, { headers: this.getHeaders() });
  }

  // Eliminar tarea (soft delete)
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
