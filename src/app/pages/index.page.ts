import { Component, effect, inject } from '@angular/core';
import { load } from './index.server';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectLoad } from '@analogjs/router';
import { TodoState } from '../state/todo.state';
import { TodoComponent } from '../ui/todo.component';
import { CreateFormComponent } from '../ui/create-form.component';
import { DarkModeToggleComponent } from '../ui/dark-mode-toggle.component';
import { FooterComponent } from '../ui/footer.component';
import { FilterComponent } from '../ui/filter.component';
import { TodoListComponent } from '../ui/todo-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header class="w-full h-72 bg-cover bg-center -z-10 bg-[url(/images/bg-desktop-light.jpg)] dark:bg-[url(/images/bg-desktop-dark.jpg)] "></header>

    <main class="w-full max-w-[500px] mx-auto -mt-72 relative px-4">
      <h1 class="text-white text-5xl tracking-[.25em] leading-none font-bold pt-16 pb-10 flex justify-between">
        TODO
        <app-dark-mode-toggle/>
      </h1>
      <app-create-form/>

      <section class="bg-card text-card-foreground rounded-lg md:rounded shadow-lg">
        <app-todo-list/>
        <app-footer/>
      </section>

      <app-filter class="block md:hidden bg-card mt-8 px-6 py-4 text-xs text-center rounded-lg md:rounded shadow-lg"/>
    </main>
  `,
  imports: [
    TodoComponent,
    CreateFormComponent,
    DarkModeToggleComponent,
    FooterComponent,
    FilterComponent,
    TodoListComponent,
  ],
  providers: [
    TodoState,
  ]
})
export default class HomeComponent {
  readonly store = inject(TodoState);

  public data = toSignal(injectLoad<typeof load>(), { requireSync: true });

  constructor() {
    effect(() => this.store.setInitialState(this.data()), { allowSignalWrites: true });
  }
}
