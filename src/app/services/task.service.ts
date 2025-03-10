import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task'
import { environment } from 'src/environments/environment';
import { Respuesta } from '../models/respuesta';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiEndpoint;

  private token: string = sessionStorage.getItem("authToken") ?? '';
  constructor(private http: HttpClient) { }

  // Obtener todas las tareas
  getTasks(): Observable<Respuesta> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<Respuesta>(this.apiUrl, { headers });
  }

  // Crear una nueva tarea
  createTask(task: Task): Observable<Task> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Task>(this.apiUrl, task, { headers });
  }

  // Actualizar el estado de una tarea
  updateTask(task: Task): Observable<Task> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task, { headers });
  }

  // Eliminar una tarea
  deleteTask(id: string): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}/${id}`;
    console.log("Url: ", url);
    return this.http.delete<void>(url, { headers });
  }
}
