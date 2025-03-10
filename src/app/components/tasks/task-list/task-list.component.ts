import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService } from './../../../services/task.service';
import { Task } from '../../../models/task';
import { Respuesta } from '../../../models/respuesta';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalTaskComponent } from 'src/app/modals/modal-task/modal-task.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  productForm: FormGroup;
  tasks: Task[] = new Array<Task>();
  displayedColumns: string[] = ['title', 'status', 'actions'];

  constructor(private taskService: TaskService, private fb: FormBuilder, private dialog: MatDialog) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]], // Validación para el nombre
      description: [''],
      status: ['POR HACER', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.tasks = new Array<Task>();
    this.getTasks();
  }
  getTasks() {
    this.taskService.getTasks().subscribe(
      (respuesta: Respuesta) => {
        this.tasks = respuesta.result; // Asigna directamente el resultado a tasks
      },
      (error) => {
        console.error('Error obteniendo lista de tareas:', error); // Maneja el error adecuadamente
      }
    );
  }

  updateTask(task: Task): void {
    this.openModal(task);
  }

  deleteTask(taskId: string): void {
    console.log("TaskId: ", taskId);
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe(
        () => {
          console.log('Tarea eliminada correctamente');
          this.getTasks();
        },
        (error) => {
          console.error('Error al eliminar la tarea:', error);
        }
      );
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'POR HACER':
        return 'warn'; // Azul o color primario
      case 'EN PROGRESO':
        return 'info'; // Rojo o amarillo
      case 'COMPLETADA':
        return 'primary'; // Un color diferente (puedes ajustarlo)
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'POR HACER':
        return 'pending'; // Ícono de activado
      case 'EN PROGRESO':
        return 'hourglass_empty'; // Ícono de cancelado
      case 'COMPLETADA':
        return 'check_circle'; // Ícono de camión
      default:
        return 'help'; // Ícono por defecto
    }
  }

  openModal(task: Task | null): void {

    var titulo = task == null ? "Agregar Tarea": "Editar Tarea";
    this.dialog.open(ModalTaskComponent, {
      width: '650px',
      height: '485px',
      panelClass: 'custom-modal',
      data: { 
        task, 
        title: titulo
      }
    });
  }

}
