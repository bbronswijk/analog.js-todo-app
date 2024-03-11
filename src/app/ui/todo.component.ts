import {
  ChangeDetectionStrategy,
  Component, OnInit, inject, DestroyRef, effect, input
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '@prisma/client';
import { CheckboxComponent } from './checkbox.component';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TodoState } from '../state/todo.state';

@Component({
  selector: 'app-todo',
  template: `
    <form class="flex relative border-b border-border group">
      <input type="text"
             [formControl]="description"
             class="bg-transparent text-card-foreground border-none pr-6 pl-16 py-5 w-full focus:outline-none"
             [class.line-through]="checked()"
             [class.opacity-25]="checked()"
             placeholder="Describe todo..." />
      <app-checkbox name="completed"
                    [ngModel]="checked()"
                    (ngModelChange)="onToggleCompleted($event)"
                    class="absolute left-6 top-1/2 -translate-y-1/2"/>
      <button type="submit" class="text-card-foreground hover:text-card-hover mr-6 opacity-0 group-hover:opacity-100 duration-300"
              (click)="delete()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
          <path fill="currentcolor" fill-rule="evenodd"
                d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/>
        </svg>
      </button>
    </form>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    ReactiveFormsModule,
    CheckboxComponent,
    FormsModule
  ]
})
export class TodoComponent implements OnInit {
  private store = inject(TodoState);
  private destroyRef = inject(DestroyRef);

  public checked = input.required<boolean>();
  public description = new FormControl<string>('',{ nonNullable: true, validators: [Validators.required] })

  public todo = input.required<Todo>();

  constructor() {
    effect(() => {
      this.description.setValue(this.todo().description, { emitEvent: false });
    }, { allowSignalWrites: true });
  }

  public onToggleCompleted(completed: boolean): void {
    this.store.update({ id: this.todo().id, value: { completed } })
  }

  /**
   * Debounce the description changes.
   */
  public ngOnInit(): void {
    this.description?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(),
      filter(() => this.description.valid),
      debounceTime(500),
      tap((description: string) => this.store.update({ id: this.todo().id, value: { description } }))
    ).subscribe();
  }

  public delete(): void {
    this.store.remove(this.todo());
  }
}
