import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '@prisma/client';
import { PostTodoRequestType } from '../../server/routes/v1/todo.post';
import { PatchTodoRequestType } from '../../server/routes/v1/todo/[id].patch';

@Injectable({
  providedIn: 'root',
})
export class TodoApi {
  private http = inject(HttpClient);

  public post(request: PostTodoRequestType): Observable<Todo> {
    return this.http.post<Todo>('/api/v1/todo', request);
  }

  public patch(id: string, request: PatchTodoRequestType): Observable<Todo> {
    return this.http.patch<Todo>(`/api/v1/todo/${id}`, request);
  }

  public delete(id: string): Observable<Todo> {
    return this.http.delete<Todo>(`/api/v1/todo/${id}`);
  }

  public deleteMany(deleteIds: string[]): Observable<void> {
    return this.http.delete<void>(`/api/v1/todos`, { body: { deleteIds } });
  }
}
