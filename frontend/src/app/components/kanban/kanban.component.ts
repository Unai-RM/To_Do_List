import { Component, OnInit } from '@angular/core';
import { TaskStatus, TaskColumn } from '../../models/task.model';

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

  constructor() { }

  ngOnInit(): void {
    // Por ahora sin funcionalidad
  }
}
