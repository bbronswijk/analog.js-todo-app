import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';
import { TodoState } from '../state/todo.state';

@Component({
  selector: 'app-create-form',
  standalone: true,
  template: `
    <form [formGroup]="form" (ngSubmit)="save($event)"  class="bg-card text-card-foreground mb-8 rounded-lg md:rounded shadow-lg flex relative">
      <app-checkbox formControlName="completed" type="checkbox" class="absolute left-6 top-1/2 -translate-y-1/2"/>
      <input formControlName="description" type="text"
             class="bg-transparent text-card-foreground border-none pr-6 pl-16 py-5 w-full focus:outline-none"
             placeholder="Create a new todo..."/>
    </form>
  `,
  imports: [
    ReactiveFormsModule,
    CheckboxComponent
  ]
})
export class CreateFormComponent {
  private store = inject(TodoState);

  public form: FormGroup = new FormGroup({
    completed: new FormControl(false, { nonNullable: true }),
    description: new FormControl('',{ nonNullable: true, validators: [Validators.required] }),
  });

  public save(e: Event): void {
    e.preventDefault();

    if (this.form.invalid) {
      return;
    }

    this.store.add(this.form.value);
    this.form.reset();
  }
}
