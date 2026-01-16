import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <div class="header">
        <h1>Usuários Cadastrados</h1>
        <div class="user-info">
          <span class="user-name">{{ currentUser?.name }}</span>
          <button (click)="logout()" class="btn-logout">
            <span class="btn-text">Sair</span>
            <span class="btn-icon">🚪</span>
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando usuários...</p>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <div *ngIf="!loading && users.length > 0" class="users-grid">
        <div *ngFor="let user of users" class="user-card">
          <div class="user-icon">👤</div>
          <h3>{{ user.name }}</h3>
          <p class="user-email">{{ user.email }}</p>
        </div>
      </div>

      <div *ngIf="!loading && users.length === 0 && !errorMessage" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>Nenhum usuário cadastrado ainda.</p>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #eee;
      gap: 20px;
    }

    h1 {
      margin: 0;
      color: #333;
      font-size: 1.75rem;
      flex-shrink: 1;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
      flex-shrink: 0;
    }

    .user-name {
      color: #666;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: background 0.2s, transform 0.1s;
      min-height: 44px;
      white-space: nowrap;
    }

    .btn-logout:hover {
      background: #c82333;
    }

    .btn-logout:active {
      transform: scale(0.98);
    }

    .btn-icon {
      display: none;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #666;
      font-size: 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading p {
      margin: 0;
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

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .user-card {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (hover: hover) {
      .user-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
    }

    .user-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .user-card h3 {
      margin: 0 0 10px;
      color: #333;
      font-size: 1.1rem;
      word-break: break-word;
    }

    .user-email {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      word-break: break-all;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      color: #999;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .empty-state p {
      font-size: 1.1rem;
      margin: 0;
      text-align: center;
    }

    @media (max-width: 768px) {
      .users-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      h1 {
        font-size: 1.5rem;
      }

      .user-info {
        width: 100%;
        justify-content: space-between;
        align-items: center;
      }

      .user-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 150px;
      }

      .btn-logout {
        flex-shrink: 0;
      }

      .users-grid {
        gap: 16px;
      }

      .user-card {
        padding: 24px 20px;
      }

      .user-icon {
        font-size: 40px;
        margin-bottom: 12px;
      }

      .user-card h3 {
        font-size: 1rem;
      }

      .user-email {
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .users-container {
        padding: 12px;
      }

      .header {
        margin-bottom: 24px;
        padding-bottom: 16px;
      }

      h1 {
        font-size: 1.35rem;
      }

      .user-info {
        gap: 12px;
      }

      .user-name {
        font-size: 0.9rem;
        max-width: 120px;
      }

      .btn-logout {
        padding: 10px 14px;
        font-size: 0.85rem;
      }

      .btn-text {
        display: none;
      }

      .btn-icon {
        display: block;
        font-size: 1.1rem;
      }

      .users-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .user-card {
        padding: 20px 16px;
      }

      .user-icon {
        font-size: 36px;
        margin-bottom: 10px;
      }

      .empty-state {
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 48px;
      }

      .empty-state p {
        font-size: 1rem;
      }
    }

    @media (max-width: 360px) {
      h1 {
        font-size: 1.2rem;
      }

      .user-card {
        padding: 18px 14px;
      }
    }
  `]
})
export class UsersListComponent implements OnInit {
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private router = inject(Router);

  users: User[] = [];
  loading = false;
  errorMessage = '';
  currentUser: any;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erro ao carregar usuários. Tente novamente.';
        console.error('Erro:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
