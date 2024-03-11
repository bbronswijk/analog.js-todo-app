import { Component, inject } from '@angular/core';
import { TodoState } from '../state/todo.state';
import { FilterComponent } from './filter.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="grid grid-cols-2 md:grid-cols-3 px-6 py-4 text-xs">
      <div>{{ store.unCompletedCount() }} items left</div>
      <app-filter class="hidden md:block"/>
      <div class="text-right">
        <button class="text-card-foreground hover:text-card-hover"
                (click)="store.clearCompleted(undefined)">
          Clear Completed
        </button>
      </div>
    </footer>
  `,
  imports: [
    FilterComponent
  ],
})
export class FooterComponent {
  public readonly store = inject(TodoState);
}
