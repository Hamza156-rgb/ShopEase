import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  template: `
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">New Season Arrivals ✨</div>
        <h1 class="hero-title">Shop Smarter,<br/><span class="highlight">Live Better</span></h1>
        <p class="hero-sub">Discover thousands of premium products at unbeatable prices. Fast delivery, easy returns.</p>
        <div class="hero-actions">
          <button class="btn-primary" (click)="router.navigate(['/products'])">Shop Now →</button>
          <button class="btn-ghost" (click)="router.navigate(['/products'], {queryParams:{category:'Electronics'}})">View Electronics</button>
        </div>
        <div class="hero-stats">
          <div class="stat"><strong>50K+</strong><span>Products</span></div>
          <div class="stat"><strong>120K+</strong><span>Customers</span></div>
          <div class="stat"><strong>4.9★</strong><span>Rating</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-card">🛍️</div>
      </div>
    </section>

    <section class="categories-section">
      <h2 class="section-title">Browse Categories</h2>
      <div class="categories-grid">
        <div class="category-card" *ngFor="let cat of categories" (click)="browseCategory(cat)">
          <span class="cat-icon">{{ getCatIcon(cat) }}</span>
          <span class="cat-name">{{ cat }}</span>
        </div>
      </div>
    </section>

    <section class="featured-section">
      <div class="section-header">
        <h2 class="section-title">Featured Products</h2>
        <a routerLink="/products" class="see-all">See All →</a>
      </div>
      <div class="products-grid" *ngIf="!loading">
        <div class="product-card" *ngFor="let product of featured" (click)="goToProduct(product._id)">
          <div class="product-image">
            <img [src]="product.images[0] || 'assets/placeholder.png'" [alt]="product.name" />
            <div class="product-badge" *ngIf="product.originalPrice">SALE</div>
          </div>
          <div class="product-info">
            <p class="product-category">{{ product.category }}</p>
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-rating">
              <span class="stars">{{ getStars(product.ratings) }}</span>
              <span class="review-count">({{ product.numReviews }})</span>
            </div>
            <div class="product-price">
              <span class="price">\${{ product.price.toFixed(2) }}</span>
              <span class="original-price" *ngIf="product.originalPrice">\${{ product.originalPrice.toFixed(2) }}</span>
            </div>
            <button class="add-to-cart-btn" (click)="addToCart($event, product)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div class="loading" *ngIf="loading">Loading products...</div>
    </section>

    <section class="promo-banner">
      <div class="promo-content">
        <h2>Free Shipping on Orders Over $100</h2>
        <p>Use code <strong>FREESHIP</strong> at checkout</p>
        <button class="btn-primary" (click)="router.navigate(['/products'])">Shop Now</button>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  featured: Product[] = [];
  categories: string[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public router: Router
  ) {}

  ngOnInit() {
    this.productService.getFeatured().subscribe({
      next: p => { this.featured = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.productService.getCategories().subscribe(c => this.categories = c);
  }

  browseCategory(cat: string) {
    this.router.navigate(['/products'], { queryParams: { category: cat } });
  }

  goToProduct(id: string) {
    this.router.navigate(['/products', id]);
  }

  addToCart(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addToCart(product._id).subscribe();
  }

  getStars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  getCatIcon(cat: string): string {
    const icons: any = {
      Electronics: '💻', Fashion: '👗', 'Home & Garden': '🏠',
      Sports: '⚽', Books: '📚', Beauty: '💄', Toys: '🧸', Food: '🍕'
    };
    return icons[cat] || '🛍️';
  }
}
