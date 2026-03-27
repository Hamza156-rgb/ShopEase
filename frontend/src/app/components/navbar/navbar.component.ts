import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">
          <span class="brand-icon">⚡</span>
          ShopEase
        </a>

        <div class="nav-search">
          <input
            type="text"
            placeholder="Search products..."
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            class="search-input"
          />
          <button class="search-btn" (click)="onSearch()">🔍</button>
        </div>

        <div class="nav-actions">
          <a routerLink="/products" class="nav-link">Shop</a>

          <a routerLink="/cart" class="nav-cart">
            🛒
            <span class="cart-badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
          </a>

          <ng-container *ngIf="!currentUser">
            <a routerLink="/login" class="nav-btn nav-btn-outline">Login</a>
            <a routerLink="/register" class="nav-btn nav-btn-primary">Sign Up</a>
          </ng-container>

          <ng-container *ngIf="currentUser">
            <div class="user-menu" (click)="toggleMenu()">
              <span class="user-avatar">{{ currentUser.name[0].toUpperCase() }}</span>
              <span class="user-name">{{ currentUser.name }}</span>
              <span class="menu-arrow">▾</span>
              <div class="dropdown" *ngIf="menuOpen">
                <a routerLink="/orders" (click)="menuOpen=false">📦 My Orders</a>
                <a routerLink="/admin" *ngIf="isAdmin" (click)="menuOpen=false">⚙️ Admin Panel</a>
                <hr/>
                <a (click)="logout()">🚪 Logout</a>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  cartCount = 0;
  searchQuery = '';
  menuOpen = false;
  isAdmin = false;
  private subs: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subs.push(
      this.auth.user$.subscribe(u => {
        this.currentUser = u;
        this.isAdmin = u?.role === 'admin';
      }),
      this.cart.cart$.subscribe(() => {
        this.cartCount = this.cart.cartCount;
      })
    );
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
    }
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  logout() {
    this.menuOpen = false;
    this.auth.logout();
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }
}
