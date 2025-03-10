import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/task';
import { TaskService } from 'src/app/services/task.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-task-form',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss']
})
export class ModalTaskComponent implements OnInit {
  taskForm!: FormGroup;
  title: string;
  task: Task = new Task();

  statusOptions: string[] = ['POR HACER', 'EN PROGRESO', 'COMPLETADA'];

  @Output() taskAdded = new EventEmitter<Task>(); // ✅ Evento de salida

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<ModalTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task | null, title: string }
  ) {
    this.title = data.title;
    this.task = data.task ?? new Task();
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status:  ['']
    });
  }

  // Método para manejar el submit del formulario
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.createTask(this.task).subscribe(
        response => {
          this.taskAdded.emit(Object.assign(response, Task));
          this.closeModal();
        },
        error => {
          console.error("Error al guardar la tarea:", error);
        }
      );
    } else {
      console.log("Formulario inválido");
    }
  }

  onNoClick(): void {

  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

