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
          <span>Olá, {{ currentUser?.name }}</span>
          <button (click)="logout()" class="btn-logout">Sair</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Carregando usuários...</div>

      <div *ngIf="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <div *ngIf="!loading && users.length > 0" class="users-grid">
        <div *ngFor="let user of users" class="user-card">
          <div class="user-icon">👤</div>
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
      </div>

      <div *ngIf="!loading && users.length === 0 && !errorMessage" class="empty-state">
        <p>Nenhum usuário cadastrado ainda.</p>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #eee;
    }

    h1 {
      margin: 0;
      color: #333;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-info span {
      color: #666;
      font-weight: 500;
    }

    .btn-logout {
      padding: 8px 16px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .btn-logout:hover {
      background: #c82333;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 18px;
    }

    .alert {
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
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
    }

    .user-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .user-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .user-card h3 {
      margin: 0 0 10px;
      color: #333;
      font-size: 18px;
    }

    .user-card p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-state p {
      font-size: 18px;
      margin: 0;
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
