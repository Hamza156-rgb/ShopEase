import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 class="admin-brand">⚡ Admin</h2>
        <nav>
          <a routerLink="/admin">📊 Dashboard</a>
          <a routerLink="/admin/products">📦 Products</a>
          <a routerLink="/admin/orders" routerLinkActive="active">🛒 Orders</a>
          <a routerLink="/admin/users">👥 Users</a>
          <a routerLink="/">🏠 Back to Store</a>
        </nav>
      </aside>

      <main class="admin-main">
        <h1 class="admin-title">All Orders</h1>

        <div class="filter-row">
          <select [(ngModel)]="statusFilter" (change)="filterOrders()">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders">
              <td>#{{ order._id.slice(-8).toUpperCase() }}</td>
              <td>{{ order.user?.name || 'N/A' }}<br/><small>{{ order.user?.email }}</small></td>
              <td>{{ order.items.length }} item(s)</td>
              <td>\${{ order.totalPrice.toFixed(2) }}</td>
              <td>{{ order.isPaid ? '✅' : '❌' }}</td>
              <td>
                <select
                  [value]="order.status"
                  (change)="updateStatus(order._id, $any($event.target).value)"
                  class="status-select"
                  [class]="'status-' + order.status"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>{{ order.createdAt | date:'shortDate' }}</td>
              <td>
                <a [routerLink]="['/orders', order._id]" class="btn-view">View</a>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="filteredOrders.length === 0 && !loading">
          <p>No orders found.</p>
        </div>
        <div class="loading-state" *ngIf="loading"><div class="spinner"></div></div>
      </main>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter = '';
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe({
      next: o => { this.orders = o; this.filteredOrders = o; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filterOrders() {
    this.filteredOrders = this.statusFilter
      ? this.orders.filter(o => o.status === this.statusFilter)
      : this.orders;
  }

  updateStatus(id: string, status: string) {
    this.orderService.updateOrderStatus(id, status).subscribe(updated => {
      const idx = this.orders.findIndex(o => o._id === id);
      if (idx > -1) this.orders[idx] = updated;
      this.filterOrders();
    });
  }
}
