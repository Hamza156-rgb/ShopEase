import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../../../services/order.service';

@Component({
  selector: 'app-order-detail',
  template: `
    <div class="order-detail-page" *ngIf="order">
      <div class="order-detail-header">
        <button class="back-btn" (click)="router.navigate(['/orders'])">← Back to Orders</button>
        <h1>Order #{{ order._id.slice(-8).toUpperCase() }}</h1>
        <span class="order-status" [class]="'status-' + order.status">{{ order.status | titlecase }}</span>
      </div>

      <div class="order-detail-grid">
        <div class="order-items-section">
          <h2>Items</h2>
          <div class="order-item" *ngFor="let item of order.items">
            <img [src]="item.image || 'assets/placeholder.png'" [alt]="item.name" />
            <div class="item-info">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-qty">Qty: {{ item.quantity }}</p>
            </div>
            <span class="item-price">\${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <div class="order-sidebar">
          <div class="order-summary-card">
            <h3>Order Summary</h3>
            <div class="summary-row"><span>Items</span><span>\${{ order.itemsPrice.toFixed(2) }}</span></div>
            <div class="summary-row"><span>Shipping</span><span>{{ order.shippingPrice === 0 ? 'FREE' : '\$' + order.shippingPrice.toFixed(2) }}</span></div>
            <div class="summary-row"><span>Tax</span><span>\${{ order.taxPrice.toFixed(2) }}</span></div>
            <div class="summary-divider"></div>
            <div class="summary-total"><strong>Total</strong><strong>\${{ order.totalPrice.toFixed(2) }}</strong></div>
          </div>

          <div class="shipping-info-card">
            <h3>Shipping Address</h3>
            <p>{{ order.shippingAddress.street }}</p>
            <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zip }}</p>
            <p>{{ order.shippingAddress.country }}</p>
          </div>

          <div class="payment-info-card">
            <h3>Payment</h3>
            <p>Method: {{ order.paymentMethod }}</p>
            <p [class.text-success]="order.isPaid" [class.text-warning]="!order.isPaid">
              {{ order.isPaid ? '✅ Paid on ' + (order.paidAt | date:'mediumDate') : '⏳ Not paid yet' }}
            </p>
            <p>Delivery: {{ order.isDelivered ? '✅ Delivered' : '🚚 In transit' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-state" *ngIf="loading"><div class="spinner"></div></div>
  `
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, public router: Router, private orderService: OrderService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getOrder(id).subscribe({
      next: o => { this.order = o; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/orders']); }
    });
  }
}
