import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 class="admin-brand">⚡ Admin</h2>
        <nav>
          <a routerLink="/admin">📊 Dashboard</a>
          <a routerLink="/admin/products">📦 Products</a>
          <a routerLink="/admin/orders">🛒 Orders</a>
          <a routerLink="/admin/users" routerLinkActive="active">👥 Users</a>
          <a routerLink="/">🏠 Back to Store</a>
        </nav>
      </aside>

      <main class="admin-main">
        <h1 class="admin-title">Users</h1>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>
                <span class="user-avatar-sm">{{ user.name[0] }}</span>
                {{ user.name }}
              </td>
              <td>{{ user.email }}</td>
              <td>
                <select
                  [value]="user.role"
                  (change)="updateRole(user._id, $any($event.target).value)"
                  class="role-select"
                  [class.admin-role]="user.role === 'admin'"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{{ user.createdAt | date:'shortDate' }}</td>
              <td>
                <button class="btn-delete" (click)="deleteUser(user._id, user.name)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="users.length === 0 && !loading"><p>No users found.</p></div>
        <div class="loading-state" *ngIf="loading"><div class="spinner"></div></div>
      </main>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getUsers().subscribe({
      next: u => { this.users = u; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  updateRole(id: string, role: string) {
    this.adminService.updateUserRole(id, role).subscribe(updated => {
      const idx = this.users.findIndex(u => u._id === id);
      if (idx > -1) this.users[idx] = updated;
    });
  }

  deleteUser(id: string, name: string) {
    if (confirm(`Delete user "${name}"? This cannot be undone.`)) {
      this.adminService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(u => u._id !== id);
      });
    }
  }
}
