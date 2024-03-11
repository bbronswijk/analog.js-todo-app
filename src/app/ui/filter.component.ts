import { Component, inject } from '@angular/core';
import { Filter, TodoState } from '../state/todo.state';

@Component({
  selector: 'app-filter',
  standalone: true,
  template: `
      <div class="space-x-4">
        @for (filter of Object.values(Filter); track filter) {
          <button class="text-card-foreground hover:text-card-hover text-bold"
                  [class.text-primary]="store.filter() === filter"
                  (click)="store.setFilter(filter)">
            {{ filter }}
          </button>
        }
      </div>
  `,
})
export class FilterComponent {
  public readonly store = inject(TodoState);

  public Filter = Filter;

  protected readonly Object = Object;
}
