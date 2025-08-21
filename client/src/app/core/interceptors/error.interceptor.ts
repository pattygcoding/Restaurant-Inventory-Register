import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        if (error.error?.error) {
          errorMessage = error.error.error;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      // Don't show snackbar for auth errors (handled by auth service)
      if (error.status !== 401 && error.status !== 403) {
        snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }

      return throwError(() => error);
    })
  );
};