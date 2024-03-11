import { Component, inject } from '@angular/core';
import { TodoComponent } from './todo.component';
import { TodoState } from '../state/todo.state';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: `
    @for (todo of store.filteredTodos(); track todo.id) {
      <app-todo [todo]="todo"/>
    } @empty {
      <div class="p-6 text-center border-b border-border">Create a todo and start being productive! 🤓</div>
    }
  `,
  imports: [
    TodoComponent,
  ],
})
export class TodoListComponent {
  public readonly store = inject(TodoState);
}
