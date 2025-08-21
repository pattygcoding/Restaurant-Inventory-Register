import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>{{ environment.appName }}</mat-card-title>
          <mat-card-subtitle>Sign in to continue</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (environment.useMockApi) {
            <div class="demo-credentials">
              <h4>Demo Credentials:</h4>
              <p><strong>Admin:</strong> admin / ChangeMe123!</p>
              <p><strong>Cashier:</strong> cashier / Cashier123!</p>
              <p><strong>Manager:</strong> manager / Manager123!</p>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input
                matInput
                formControlName="username"
                [readonly]="loading"
                autocomplete="username"
              />
              @if (loginForm.get('username')?.hasError('required')) {
                <mat-error>Username is required</mat-error>
              }
              @if (loginForm.get('username')?.hasError('minlength')) {
                <mat-error>Username must be at least 3 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                [readonly]="loading"
                autocomplete="current-password"
              />
              <button
                mat-icon-button
                matSuffix
                (click)="hidePassword = !hidePassword"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hidePassword"
                type="button"
              >
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (loginForm.get('password')?.hasError('required')) {
                <mat-error>Password is required</mat-error>
              }
              @if (loginForm.get('password')?.hasError('minlength')) {
                <mat-error>Password must be at least 8 characters</mat-error>
              }
            </mat-form-field>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button
            mat-raised-button
            color="primary"
            (click)="onSubmit()"
            [disabled]="loginForm.invalid || loading"
            class="login-button"
          >
            @if (loading) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              Sign In
            }
          </button>
        </mat-card-actions>

        @if (!environment.useMockApi) {
          <mat-card-footer>
            <p>
              Don't have an account?
              <a routerLink="/auth/register">Register here</a>
            </p>
          </mat-card-footer>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(45deg, #1e3c72, #2a5298);
      padding: 20px;
    }

    .login-card {
      max-width: 400px;
      width: 100%;
    }

    .full-width {
      width: 100%;
    }

    .login-button {
      width: 100%;
      height: 48px;
      margin-top: 16px;
    }

    .demo-credentials {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .demo-credentials h4 {
      margin: 0 0 8px 0;
    }

    .demo-credentials p {
      margin: 4px 0;
      font-family: monospace;
    }

    mat-card-footer {
      padding: 16px;
      text-align: center;
    }

    mat-card-footer a {
      color: #1976d2;
      text-decoration: none;
    }

    mat-card-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  protected environment = environment;
  protected hidePassword = true;
  protected loading = false;

  protected loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  ngOnInit() {
    // Pre-fill with demo credentials in showcase mode
    if (environment.useMockApi) {
      this.loginForm.patchValue({
        username: 'admin',
        password: 'ChangeMe123!'
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/pos']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            error.error?.error || 'Login failed. Please try again.',
            'Close',
            { duration: 5000 }
          );
        }
      });
    }
  }
}