import {HttpErrorResponse} from '@angular/common/http';
import {Observable, catchError, map, throwError} from 'rxjs';

/**
 * Every endpoint in this app answers with a status, and when it fails, a
 * message written for the user rather than for a log.
 */
export interface ApiResponse {
  status: string;
  msg?: string;
}

export const NETWORK_ERROR = "Could not reach the server, please try again";

/**
 * Unwraps the response envelope so callers receive the payload on its own.
 *
 * A failed status is raised as an Error carrying the backend's own message, and
 * an unreachable server is raised as a generic one. Both land in the caller's
 * error handler, so the status check is written once here instead of being
 * repeated at every call site.
 */
export function unwrap<T extends ApiResponse, V>(select: (response: T) => V) {
  return (source: Observable<T>): Observable<V> => source.pipe(
    map(response => {
      if(response.status !== "success"){
        throw new Error(response.msg || "please try again");
      }
      return select(response);
    }),
    catchError(error => throwError(() =>
      error instanceof HttpErrorResponse ? new Error(NETWORK_ERROR) : error
    )),
  );
}
