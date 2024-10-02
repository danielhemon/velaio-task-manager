import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskWizard } from '../models/task-wizard.model';

@Injectable({
  providedIn: 'root',
})
export class TaskWizardService {
  private taskId = 4;

  private taskSubject: BehaviorSubject<TaskWizard> =
    new BehaviorSubject<TaskWizard>({
      tasks: [
        {
          id: 1,
          title: 'Task 1',
          description: 'Task 1 description',
          status: 'todo',
          assignee: [{ name: 'John', age: 22, skills: ['oral expression'] }],
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Task 2 description',
          status: 'in-progress',
          assignee: [{ name: 'Jane', age: 18, skills: ['read'] }],
        },
        {
          id: 3,
          title: 'Task 3',
          description: 'Task 3 description',
          status: 'done',
          assignee: [{ name: 'Mark', age: 30, skills: ['communication'] }],
        },
      ],
    });

  public task$: Observable<TaskWizard> = this.taskSubject.asObservable();

  constructor() {}

  getTaskObs(): Observable<TaskWizard> {
    return this.task$;
  }

  addTask(task: Task): void {
    const taskSubj = this.taskSubject.getValue();
    task.id, (this.taskId = this.taskId + 1);
    taskSubj.tasks.push(task);
    this.taskSubject.next(taskSubj);
  }

  changeTaskState(id: number, status: 'todo' | 'in-progress' | 'done'): void {
    const taskSubj = this.taskSubject.getValue();
    const task = taskSubj.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
    }
    this.taskSubject.next(taskSubj);
  }

  deleteTask(id: number): void {
    const taskSubj = this.taskSubject.getValue();
    taskSubj.tasks = taskSubj.tasks.filter((task) => task.id !== id);
    this.taskSubject.next(taskSubj);
  }
}
