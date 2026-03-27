import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../../services/order.service';

@Component({
  selector: 'app-order-list',
  template: `
    <div class="orders-page">
      <h1 class="page-title">My Orders</h1>

      <div class="orders-list" *ngIf="!loading && orders.length">
        <div class="order-card" *ngFor="let order of orders" (click)="router.navigate(['/orders', order._id])">
          <div class="order-header">
            <div>
              <span class="order-id">#{{ order._id.slice(-8).toUpperCase() }}</span>
              <span class="order-date">{{ order.createdAt | date:'mediumDate' }}</span>
            </div>
            <span class="order-status" [class]="'status-' + order.status">{{ order.status | titlecase }}</span>
          </div>
          <div class="order-items-preview">
            <span *ngFor="let item of order.items.slice(0,3)">{{ item.name }}</span>
            <span *ngIf="order.items.length > 3">+{{ order.items.length - 3 }} more</span>
          </div>
          <div class="order-footer">
            <span class="order-total">\${{ order.totalPrice.toFixed(2) }}</span>
            <span class="payment-status" [class.paid]="order.isPaid">
              {{ order.isPaid ? '✅ Paid' : '⏳ Pending Payment' }}
            </span>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && !orders.length">
        <p>📦 No orders yet. <a routerLink="/products">Start shopping!</a></p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div><p>Loading orders...</p>
      </div>
    </div>
  `
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(private orderService: OrderService, public router: Router) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: o => { this.orders = o; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
