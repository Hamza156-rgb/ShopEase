import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="brand-name">ShopEase</span>
          <p>Premium shopping, effortlessly delivered.</p>
        </div>
        <div class="footer-links">
          <h4>Shop</h4>
          <a routerLink="/products">All Products</a>
          <a routerLink="/products?category=Electronics">Electronics</a>
          <a routerLink="/products?category=Fashion">Fashion</a>
        </div>
        <div class="footer-links">
          <h4>Account</h4>
          <a routerLink="/orders">My Orders</a>
          <a routerLink="/cart">Cart</a>
          <a routerLink="/login">Login</a>
        </div>
        <div class="footer-links">
          <h4>Info</h4>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 ShopEase. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private cart: CartService) {}

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.cart.loadCart().subscribe();
    }
  }
}
