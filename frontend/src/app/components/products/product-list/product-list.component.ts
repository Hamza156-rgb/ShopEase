import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, ProductFilter } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="page-container">
      <aside class="filters-panel">
        <h3 class="filter-title">Filters</h3>

        <div class="filter-group">
          <label>Category</label>
          <select [(ngModel)]="filters.category" (change)="applyFilters()">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Price Range</label>
          <div class="price-inputs">
            <input type="number" placeholder="Min" [(ngModel)]="filters.minPrice" (change)="applyFilters()" />
            <span>—</span>
            <input type="number" placeholder="Max" [(ngModel)]="filters.maxPrice" (change)="applyFilters()" />
          </div>
        </div>

        <div class="filter-group">
          <label>Sort By</label>
          <select [(ngModel)]="filters.sort" (change)="applyFilters()">
            <option value="">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>

        <button class="clear-filters-btn" (click)="clearFilters()">Clear Filters</button>
      </aside>

      <main class="products-main">
        <div class="products-header">
          <h2 class="page-title">
            {{ filters.search ? 'Results for "' + filters.search + '"' : 'All Products' }}
          </h2>
          <span class="result-count">{{ total }} products found</span>
        </div>

        <div class="products-grid" *ngIf="!loading && products.length > 0">
          <div class="product-card" *ngFor="let product of products" (click)="goToProduct(product._id)">
            <div class="product-image">
              <img [src]="product.images[0] || 'assets/placeholder.png'" [alt]="product.name" />
              <div class="product-badge" *ngIf="product.originalPrice">SALE</div>
              <div class="product-overlay">
                <button class="quick-add" (click)="addToCart($event, product)">+ Add to Cart</button>
              </div>
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
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!loading && products.length === 0">
          <p>😕 No products found. Try different filters.</p>
        </div>

        <div class="loading-state" *ngIf="loading">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">← Prev</button>
          <span *ngFor="let p of getPages()">
            <button [class.active]="p === currentPage" (click)="changePage(p)">{{ p }}</button>
          </span>
          <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">Next →</button>
        </div>
      </main>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  filters: ProductFilter = {};
  total = 0;
  totalPages = 1;
  currentPage = 1;
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getCategories().subscribe(c => this.categories = c);
    this.route.queryParams.subscribe(params => {
      this.filters = {
        search: params['search'] || '',
        category: params['category'] || '',
        sort: params['sort'] || '',
        minPrice: params['minPrice'] ? +params['minPrice'] : undefined,
        maxPrice: params['maxPrice'] ? +params['maxPrice'] : undefined,
      };
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts({ ...this.filters, page: this.currentPage, limit: 12 }).subscribe({
      next: res => {
        this.products = res.products;
        this.total = res.total;
        this.totalPages = res.pages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.router.navigate([], { queryParams: { ...this.filters, page: 1 }, queryParamsHandling: 'merge' });
  }

  clearFilters() {
    this.filters = {};
    this.router.navigate(['/products']);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToProduct(id: string) { this.router.navigate(['/products', id]); }

  addToCart(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addToCart(product._id).subscribe();
  }

  getStars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
}
