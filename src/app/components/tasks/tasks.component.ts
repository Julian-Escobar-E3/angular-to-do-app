import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FilterType, TaskModel } from '../../models/task';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  tasksList = signal<TaskModel[]>([
    { id: 1, title: 'Example Task 1', state: 'do', editing: false },
  ]);

  stateOptions: ('do' | 'doing' | 'done')[] = ['do', 'doing', 'done'];

  constructor() {
    effect(() => {
      localStorage.setItem('tasks', JSON.stringify(this.tasksList()));
    });
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('tasks');
    storage ? this.tasksList.set(JSON.parse(storage)) : this.tasksList();
    // Actualizar el signal de la fecha por cada segundo
    setInterval(() => {
      this.currentDate.set(new Date());
    }, 1000);
  }

  // show time
  currentDate = signal(new Date());

  formattedDate = computed(() => {
    const date = this.currentDate();
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12:false
    });
  });

  // show emoji like time

  emojis =  [
    {emoji:' 🏙️',hours:[0,1,2,3,4,5]},
    {emoji:' 🌄',hours:[6,7,8,9,10,11]},
    {emoji:' 🌆',hours:[12,13,14,15,16,17]},
    {emoji:' 🌃',hours:[18,19,20,21,22,23]},
  ]

  emojiTime = computed(()=>{
    const date = this.currentDate();
    const hour = date.getHours();

    const objEH = this.emojis.find(e => e.hours.includes(hour));

    return objEH ? objEH.emoji:'⌛';

  });




  // filter
  filter = signal<FilterType>('all');

  // change filter
  changeFilter(filterString: FilterType) {
    this.filter.set(filterString);
  }

  // filter options

  filterOptions = computed(() => {
    const currentFilter = this.filter();
    const currentTasks = this.tasksList();

    switch (currentFilter) {
      case 'do':
        return currentTasks.filter((myTasksList) => myTasksList.state === 'do');
      case 'doing':
        return currentTasks.filter(
          (myTasksList) => myTasksList.state === 'doing'
        );
      case 'done':
        return currentTasks.filter(
          (myTasksList) => myTasksList.state === 'done'
        );
      default:
        return currentTasks;
    }
  });

  // task validation
  validateTask = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)],
  });

  // new task
  newTask() {
    const newTaskTitle = this.validateTask.value.trim();

    if (this.validateTask.valid && newTaskTitle !== '') {
      this.tasksList.update((myTasksList) => {
        return [
          ...myTasksList,
          { id: Date.now(), title: newTaskTitle, state: 'do' },
        ];
      });
      this.validateTask.reset();
    } else {
      this.validateTask.reset();
    }
  }

  // update task
  updateTask(taskId: number, event: Event) {
    const title = (event.target as HTMLInputElement).value;
    return this.tasksList.update((myTasksList) =>
      myTasksList.map((myTask) => {
        return myTask.id === taskId
          ? { ...myTask, title: title, editing: false }
          : myTask;
      })
    );
  }

  // remove task
  removeTask(taskId: number) {
    this.tasksList.update((myTasksList) =>
      myTasksList.filter((task) => task.id !== taskId)
    );
  }

  // editing mode

  editingMode(taskId: number) {
    console.log('Editando...', taskId);
    return this.tasksList.update((myTasksList) =>
      myTasksList.map((myTask) => {
        return myTask.id === taskId
          ? { ...myTask, editing: true }
          : { ...myTask, editing: false };
      })
    );
  }

  // Disable select control
  getState(taskState: string): string {
    switch (taskState) {
      case 'do':
        return 'list-group-item-primary';
      case 'doing':
        return 'list-group-item-warning';
      case 'done':
        return 'list-group-item-success';
      default:
        return 'list-group-item-light';
    }
  }

  // show edit option

  editOption(taskId: number, taskState: 'do' | 'doing' | 'done') {
    console.log(taskId, taskState);

    return this.tasksList.update((myTasksList) =>
      myTasksList.map((myTask) => {
        return myTask.id === taskId ? { ...myTask, state: taskState } : myTask;
      })
    );
  }
}
