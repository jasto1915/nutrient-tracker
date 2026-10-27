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
 * Turns whatever failed into the Error the caller should show.
 *
 * The backend answers a rejected request with a 4xx or 5xx whose body is still
 * the usual envelope, so the message it wrote for the user is read back out of
 * there. Only a genuinely unreachable server, which has no body to read, falls
 * back to the generic message.
 */
export function toError(error: unknown): Error {
  if(error instanceof HttpErrorResponse){
    const msg = (error.error as ApiResponse | null)?.msg;
    return new Error(msg || NETWORK_ERROR);
  }
  return error instanceof Error ? error : new Error(NETWORK_ERROR);
}

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
    catchError(error => throwError(() => toError(error))),
  );
}
