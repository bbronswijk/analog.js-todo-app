import { patchState, signalState } from '@ngrx/signals';
import { Todo } from '@prisma/client';
import { computed, inject, Injectable } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe, tap } from 'rxjs';
import { TodoApi } from '../api/todo.api';
import { PatchTodoRequestType } from '../../server/routes/v1/todo/[id].patch';
import { PostTodoRequestType } from '../../server/routes/v1/todo.post';

export const Filter = {
  All: 'All',
  Active: 'Active',
  Completed: 'Completed'
} as const;


interface TodoStore {
  todos: Todo[];
  filter: keyof typeof Filter;
}

@Injectable()
export class TodoState {
  public todoApi = inject(TodoApi);

  /**
   * The state of the store.
   */
  readonly #state = signalState<TodoStore>({
    todos: [],
    filter: Filter.All,
  });

  public filter = this.#state.filter;
  public todos = this.#state.todos

  /**
   * Return the todos based on the current filter.
   */
  public filteredTodos = computed(() => {
    return this.todos().filter((todo) => {
      switch (this.filter()) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  });

  /**
   * Get the ids of all completed todos.
   */
  public completedIds = computed(() => this.#state.todos()
    .filter(t => t.completed)
    .map(({ id }) => id));

  /** Amount of completed todos */
  public unCompletedCount = computed(() => this.#state.todos().filter(t => !t.completed).length);

  /**
   * Store the server rendered items in the signal store.
   */
  public setInitialState(value: Pick<TodoStore, 'todos'>): void {
    patchState(this.#state, value);
  }

  /**
   * Filter the todos based on the provided filter.
   */
  public setFilter(filter: keyof typeof Filter): void {
    patchState(this.#state, { filter });
  }

  /**
   * Add a new item to the database.
   */
  readonly add = rxMethod<PostTodoRequestType>(
    pipe(
      mergeMap((todo) => this.todoApi.post(todo).pipe(
        tap((todo: Todo) => patchState(this.#state, {
          todos: [todo, ...this.#state.todos()]
        }))
      ))
    )
  );

  /**
   * Update the provided item in the database.
   */
  readonly update = rxMethod<{ id: string, value: PatchTodoRequestType}>(
    pipe(
      mergeMap(({ id, value }) => this.todoApi.patch(id, value).pipe(
        tap((todo: Todo) => patchState(this.#state, {
          todos: this.#state.todos().map(t => t.id === todo.id ? todo : t)
        }))
      ))
    )
  );

  /**
   * Delete the provided item from the database.
   */
  readonly remove = rxMethod<Todo>(
    pipe(
      mergeMap((todo) => this.todoApi.delete(todo.id).pipe(
        tap(() => patchState(this.#state, {
          todos: this.#state.todos().filter(t => t.id !== todo.id)
        }))
      ))
    )
  );

  /**
   * Delete all completed todos.
   */
  readonly clearCompleted = rxMethod<void>(
    pipe(
      mergeMap(() => this.todoApi.deleteMany(this.completedIds()).pipe(
        tap(() => patchState(this.#state, {
          todos: this.#state.todos().filter(t => !this.completedIds().includes(t.id))
        }))
      ))
    )
  );
}
