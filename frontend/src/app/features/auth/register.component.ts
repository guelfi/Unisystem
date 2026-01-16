import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Cadastro</h2>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Nome</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              placeholder="Seu nome completo"
              autocapitalize="words"
              autocomplete="name"
              [class.error]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
            />
            <small *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched" class="error-message">
              Nome é obrigatório
            </small>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="seu@email.com"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="email"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            />
            <small *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-message">
              Email inválido
            </small>
          </div>

          <div class="form-group password-group">
            <label for="password">Senha</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="Mínimo 6 caracteres"
                autocomplete="new-password"
                [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              />
              <button
                type="button"
                class="toggle-password"
                (click)="togglePassword()"
                [attr.aria-label]="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <small *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-message">
              Senha deve ter no mínimo 6 caracteres
            </small>
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <button type="submit" [disabled]="registerForm.invalid || loading" class="btn-primary">
            <span *ngIf="!loading">Cadastrar</span>
            <span *ngIf="loading">Cadastrando...</span>
          </button>
        </form>

        <p class="auth-link">
          Já tem conta? <a routerLink="/login">Faça login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      min-height: 100dvh;
      padding: 20px;
      background: #f5f5f5;
    }

    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h2 {
      margin: 0 0 30px;
      text-align: center;
      color: #333;
      font-size: 1.75rem;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
      min-height: 48px;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    input.error {
      border-color: #e74c3c;
    }

    input.error:focus {
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }

    .password-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .password-input-wrapper input {
      padding-right: 50px;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 8px;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .toggle-password:hover,
    .toggle-password:active {
      opacity: 1;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 6px;
      display: block;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .alert-error {
      background-color: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }

    .alert-success {
      background-color: #efe;
      color: #3c3;
      border: 1px solid #cfc;
    }

    .btn-primary {
      width: 100%;
      padding: 14px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      min-height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-primary:active:not(:disabled) {
      transform: scale(0.98);
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .auth-link {
      margin-top: 24px;
      text-align: center;
      color: #666;
      font-size: 0.95rem;
    }

    .auth-link a {
      color: #007bff;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 16px;
      }

      .auth-card {
        padding: 24px 20px;
      }

      h2 {
        margin: 0 0 20px;
        font-size: 1.5rem;
      }

      input {
        padding: 12px;
        font-size: 16px;
      }

      .btn-primary {
        padding: 14px;
        font-size: 1rem;
      }

      .form-group {
        margin-bottom: 16px;
      }
    }

    @media (max-width: 360px) {
      .auth-card {
        padding: 20px 16px;
      }

      h2 {
        font-size: 1.35rem;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.successMessage = 'Cadastro realizado com sucesso! Redirecionando...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erro ao cadastrar. Tente novamente.';
        }
      });
    }
  }
}
