import {
  ChangeDetectionStrategy,
  Component, OnInit, inject, DestroyRef, effect, input
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '@prisma/client';
import { CheckboxComponent } from './checkbox.component';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TodoState } from '../state/todo.state';
import { PatchTodoRequestType } from '../../server/routes/v1/todo/[id].patch';

@Component({
  selector: 'app-todo',
  template: `
    <form [formGroup]="form" class="flex relative border-b border-border group">
      <input formControlName="description"
             type="text"
             class="bg-transparent text-card-foreground border-none pr-6 pl-16 py-5 w-full focus:outline-none"
             [class.line-through]="form.get('completed')?.value"
             [class.opacity-25]="form.get('completed')?.value"
             placeholder="Describe todo..." />
      <app-checkbox formControlName="completed"
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
    CheckboxComponent
  ]
})
export class TodoComponent implements OnInit {
  private store = inject(TodoState);
  private destroyRef = inject(DestroyRef);

  public form: FormGroup = new FormGroup({
    completed: new FormControl(false, { nonNullable: true }),
    description: new FormControl('',{ nonNullable: true, validators: [Validators.required] }),
  });

  public todo = input.required<Todo>();

  constructor() {
    effect(() => {
      this.form.setValue({
        description: this.todo().description,
        completed: this.todo().completed
      }, { emitEvent: false });
    }, { allowSignalWrites: true });
  }

  public ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged((a, b) => a.description === b.description && a.completed === b.completed),
      filter(() => this.form.valid),
      debounceTime(500),
      tap((value: PatchTodoRequestType) => this.store.update({ id: this.todo().id, value }))
    ).subscribe();
  }

  public delete(): void {
    this.store.remove(this.todo());
  }
}
