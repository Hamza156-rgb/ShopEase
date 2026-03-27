import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 class="admin-brand">⚡ Admin</h2>
        <nav>
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">📊 Dashboard</a>
          <a routerLink="/admin/products" routerLinkActive="active">📦 Products</a>
          <a routerLink="/admin/orders" routerLinkActive="active">🛒 Orders</a>
          <a routerLink="/admin/users" routerLinkActive="active">👥 Users</a>
          <a routerLink="/">🏠 Back to Store</a>
        </nav>
      </aside>

      <main class="admin-main">
        <h1 class="admin-title">Dashboard</h1>

        <div class="stats-grid" *ngIf="stats">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <span class="stat-value">\${{ stats.totalRevenue?.toFixed(2) || '0.00' }}</span>
              <span class="stat-label">Total Revenue</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🛒</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalOrders }}</span>
              <span class="stat-label">Total Orders</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalProducts }}</span>
              <span class="stat-label">Products</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalUsers }}</span>
              <span class="stat-label">Users</span>
            </div>
          </div>
        </div>

        <div class="recent-orders-section" *ngIf="stats?.recentOrders">
          <h2>Recent Orders</h2>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of stats.recentOrders">
                <td>#{{ order._id.slice(-8).toUpperCase() }}</td>
                <td>{{ order.user?.name || 'N/A' }}</td>
                <td>\${{ order.totalPrice?.toFixed(2) }}</td>
                <td><span class="status-badge" [class]="'status-' + order.status">{{ order.status }}</span></td>
                <td>{{ order.createdAt | date:'shortDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getStats().subscribe(s => this.stats = s);
  }
}
