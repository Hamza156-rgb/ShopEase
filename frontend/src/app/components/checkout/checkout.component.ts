import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout-page">
      <h1 class="page-title">Checkout</h1>

      <div class="checkout-layout">
        <!-- Shipping Form -->
        <div class="checkout-form-section">
          <h2>Shipping Information</h2>
          <form [formGroup]="shippingForm">
            <div class="form-row">
              <div class="form-group">
                <label>Street Address *</label>
                <input type="text" formControlName="street" placeholder="123 Main St" />
              </div>
            </div>
            <div class="form-row two-col">
              <div class="form-group">
                <label>City *</label>
                <input type="text" formControlName="city" placeholder="New York" />
              </div>
              <div class="form-group">
                <label>State</label>
                <input type="text" formControlName="state" placeholder="NY" />
              </div>
            </div>
            <div class="form-row two-col">
              <div class="form-group">
                <label>ZIP Code *</label>
                <input type="text" formControlName="zip" placeholder="10001" />
              </div>
              <div class="form-group">
                <label>Country *</label>
                <input type="text" formControlName="country" placeholder="United States" />
              </div>
            </div>
          </form>

          <h2>Payment Method</h2>
          <div class="payment-options">
            <label class="payment-option" [class.selected]="paymentMethod === 'stripe'">
              <input type="radio" [(ngModel)]="paymentMethod" value="stripe" />
              💳 Credit/Debit Card (Stripe)
            </label>
            <label class="payment-option" [class.selected]="paymentMethod === 'cod'">
              <input type="radio" [(ngModel)]="paymentMethod" value="cod" />
              💵 Cash on Delivery
            </label>
          </div>

          <div class="stripe-note" *ngIf="paymentMethod === 'stripe'">
            <p>🔒 Secure payment via Stripe. Card details processed safely.</p>
            <p><em>In production, integrate Stripe Elements here.</em></p>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="checkout-summary">
          <h2>Order Summary</h2>
          <div class="summary-items">
            <div class="summary-item" *ngFor="let item of cart.items">
              <span class="item-name">{{ item.product.name }} × {{ item.quantity }}</span>
              <span class="item-price">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row"><span>Subtotal</span><span>\${{ subtotal.toFixed(2) }}</span></div>
          <div class="summary-row"><span>Shipping</span><span>{{ subtotal > 100 ? 'FREE' : '\$9.99' }}</span></div>
          <div class="summary-row"><span>Tax (15%)</span><span>\${{ tax.toFixed(2) }}</span></div>
          <div class="summary-divider"></div>
          <div class="summary-total"><strong>Total</strong><strong>\${{ total.toFixed(2) }}</strong></div>

          <button
            class="btn-place-order"
            (click)="placeOrder()"
            [disabled]="shippingForm.invalid || loading"
          >
            {{ loading ? 'Placing Order...' : 'Place Order →' }}
          </button>

          <p class="error-msg" *ngIf="error">{{ error }}</p>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  shippingForm: FormGroup;
  paymentMethod = 'stripe';
  cart: any = { items: [] };
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      zip: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cartService.cart$.subscribe(c => this.cart = c);
  }

  get subtotal(): number { return this.cartService.cartTotal; }
  get shipping(): number { return this.subtotal > 100 ? 0 : 9.99; }
  get tax(): number { return this.subtotal * 0.15; }
  get total(): number { return this.subtotal + this.shipping + this.tax; }

  placeOrder() {
    if (this.shippingForm.invalid) return;
    this.loading = true;
    this.error = '';

    const orderData = {
      items: this.cart.items.map((i: any) => ({
        productId: i.product._id,
        quantity: i.quantity
      })),
      shippingAddress: this.shippingForm.value,
      paymentMethod: this.paymentMethod
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        if (this.paymentMethod === 'stripe') {
          // Simulate payment success for demo
          this.orderService.payOrder(order._id, {
            id: 'pi_demo_' + Date.now(),
            status: 'succeeded',
            email: 'demo@shopease.com'
          }).subscribe(() => {
            this.router.navigate(['/orders', order._id]);
          });
        } else {
          this.router.navigate(['/orders', order._id]);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to place order.';
        this.loading = false;
      }
    });
  }
}
