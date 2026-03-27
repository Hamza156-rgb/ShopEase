import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, Cart } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="cart-page">
      <h1 class="page-title">Shopping Cart</h1>

      <div class="cart-layout" *ngIf="cart?.items?.length">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cart.items">
            <img [src]="item.product.images[0] || 'assets/placeholder.png'" [alt]="item.product.name" class="cart-item-img" />
            <div class="cart-item-info">
              <h3>{{ item.product.name }}</h3>
              <p class="cart-item-price">\${{ item.product.price.toFixed(2) }}</p>
            </div>
            <div class="cart-item-controls">
              <button class="qty-btn" (click)="updateQty(item, item.quantity - 1)">−</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button class="qty-btn" (click)="updateQty(item, item.quantity + 1)" [disabled]="item.quantity >= item.product.stock">+</button>
            </div>
            <span class="cart-item-total">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
            <button class="remove-btn" (click)="removeItem(item.product._id)">✕</button>
          </div>
        </div>

        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal ({{ itemCount }} items)</span>
            <span>\${{ cartTotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>{{ cartTotal > 100 ? 'FREE' : '\$9.99' }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (15%)</span>
            <span>\${{ (cartTotal * 0.15).toFixed(2) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-total">
            <strong>Total</strong>
            <strong>\${{ getTotal().toFixed(2) }}</strong>
          </div>
          <button class="btn-checkout" (click)="checkout()">Proceed to Checkout →</button>
          <a routerLink="/products" class="continue-shopping">← Continue Shopping</a>
        </div>
      </div>

      <div class="empty-cart" *ngIf="!cart?.items?.length">
        <div class="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button class="btn-primary" (click)="router.navigate(['/products'])">Start Shopping</button>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [] };

  constructor(
    public cartService: CartService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.cartService.loadCart().subscribe();
    }
    this.cartService.cart$.subscribe(c => this.cart = c);
  }

  get itemCount(): number {
    return this.cart.items.reduce((s, i) => s + i.quantity, 0);
  }

  get cartTotal(): number {
    return this.cartService.cartTotal;
  }

  getTotal(): number {
    const shipping = this.cartTotal > 100 ? 0 : 9.99;
    return this.cartTotal + shipping + this.cartTotal * 0.15;
  }

  updateQty(item: any, qty: number) {
    this.cartService.updateQuantity(item.product._id, qty).subscribe();
  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId).subscribe();
  }

  checkout() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}
