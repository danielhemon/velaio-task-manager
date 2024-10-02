import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TaskWizardService } from '../../services/task-wizard.service';
import { TaskWizard } from '../../models/task-wizard.model';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FontAwesomeModule, NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  wizard: TaskWizard;
  tasksTodo: Task[] = [];
  tasksInProgress: Task[] = [];
  tasksDone: Task[] = [];
  showAddForm = false;
  taskForm: FormGroup;

  constructor(
    private wizardService: TaskWizardService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initWizard();
    this.initForm();
  }

  initWizard(): void {
    this.wizardService.getTaskObs().subscribe((wizard) => {
      this.wizard = wizard;
      this.filterTasks();
    });
  }

  filterTasks(): void {
    if (this.wizard.tasks.length) {
      this.tasksTodo = this.wizard.tasks.filter(
        (task) => task.status === 'todo'
      );
      this.tasksInProgress = this.wizard.tasks.filter(
        (task) => task.status === 'in-progress'
      );
      this.tasksDone = this.wizard.tasks.filter(
        (task) => task.status === 'done'
      );
    } else {
      this.tasksTodo = [];
      this.tasksInProgress = [];
      this.tasksDone = [];
    }
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      assignedTo: new FormArray(
        [
          new FormGroup({
            name: new FormControl('', [Validators.required]),
            age: new FormControl('', [Validators.required]),
            skills: new FormControl([], [Validators.required]),
            skill: new FormControl('', []),
          }),
        ],
        [Validators.required]
      ),
    });
  }

  getCtrl(ctrl: string) {
    return this.taskForm.get(ctrl) as FormControl;
  }

  get users(): FormArray {
    return this.taskForm.get('assignedTo') as FormArray;
  }

  getUserProp(user: AbstractControl, prop: string): any {
    return user.get(prop)?.value;
  }

  getUserSkills(user: AbstractControl): any {
    return user.get('skills')?.value as Array<string>;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.wizardService.addTask({
        id: 0,
        title: this.taskForm.get('title')?.value,
        description: this.taskForm.get('description')?.value,
        status: 'todo',
        assignee: this.taskForm.get('assignedTo')?.value,
      });
      this.taskForm.reset();
      this.toggleForm();
      console.log('Formulario enviado:', this.taskForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  updateTaskStatus(
    task: Task,
    newStatus: 'todo' | 'in-progress' | 'done'
  ): void {
    this.wizardService.changeTaskState(task.id, newStatus);
    this.initWizard();
  }

  toggleForm(): void {
    this.showAddForm = !this.showAddForm;
  }
  deleteTask(task: Task): void {
    this.wizardService.deleteTask(task.id);
    this.initWizard();
  }

  addUserForm(): void {
    this.users.insert(
      0,
      new FormGroup({
        name: new FormControl('', [Validators.required]),
        age: new FormControl('', [Validators.required]),
        skills: new FormControl([], [Validators.required]),
        skill: new FormControl('', []),
      })
    );
  }

  addUserSkill(user: AbstractControl): void {
    const skill = user.get('skill')?.value;
    const skills = user.get('skills')?.value as Array<string>;
    skills.push(skill);
    user.get('skills')?.setValue(skills);
    user.get('skill')?.reset();
  }

  deleteUserSkill(user: AbstractControl, skill: string): void {
    const skills = user.get('skills')?.value as Array<string>;
    const skillIndex = skills.findIndex((x) => x === skill);
    skills.splice(skillIndex, 1);
  }
}
