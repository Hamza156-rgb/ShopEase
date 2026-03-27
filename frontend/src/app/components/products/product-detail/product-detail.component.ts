import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  template: `
    <div class="product-detail-page" *ngIf="product">
      <div class="breadcrumb">
        <a routerLink="/">Home</a> › <a routerLink="/products">Products</a> › {{ product.name }}
      </div>

      <div class="product-detail-grid">
        <div class="product-images">
          <div class="main-image">
            <img [src]="selectedImage || product.images[0] || 'assets/placeholder.png'" [alt]="product.name" />
          </div>
          <div class="image-thumbs" *ngIf="product.images.length > 1">
            <img
              *ngFor="let img of product.images"
              [src]="img"
              [class.active]="img === selectedImage"
              (click)="selectedImage = img"
            />
          </div>
        </div>

        <div class="product-details">
          <div class="product-meta">
            <span class="category-tag">{{ product.category }}</span>
            <span class="brand-tag" *ngIf="product.brand">{{ product.brand }}</span>
          </div>

          <h1 class="product-title">{{ product.name }}</h1>

          <div class="rating-row">
            <span class="stars-lg">{{ getStars(product.ratings) }}</span>
            <span class="rating-value">{{ product.ratings.toFixed(1) }}</span>
            <span class="review-count">({{ product.numReviews }} reviews)</span>
          </div>

          <div class="price-row">
            <span class="price-lg">\${{ product.price.toFixed(2) }}</span>
            <span class="original-price-lg" *ngIf="product.originalPrice">\${{ product.originalPrice.toFixed(2) }}</span>
            <span class="discount-badge" *ngIf="product.originalPrice">
              {{ getDiscount() }}% OFF
            </span>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <div class="stock-info" [class.low-stock]="product.stock < 10">
            <span *ngIf="product.stock > 0">✅ In Stock ({{ product.stock }} available)</span>
            <span *ngIf="product.stock === 0">❌ Out of Stock</span>
          </div>

          <div class="quantity-row">
            <label>Quantity:</label>
            <div class="quantity-control">
              <button (click)="quantity > 1 && quantity--">−</button>
              <span>{{ quantity }}</span>
              <button (click)="quantity < product.stock && quantity++">+</button>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn-add-cart" [disabled]="product.stock === 0" (click)="addToCart()">
              🛒 Add to Cart
            </button>
            <button class="btn-buy-now" [disabled]="product.stock === 0" (click)="buyNow()">
              ⚡ Buy Now
            </button>
          </div>

          <div class="product-tags" *ngIf="product.tags?.length">
            <span class="tag" *ngFor="let tag of product.tags">#{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <h2>Customer Reviews</h2>

        <!-- Add Review -->
        <div class="add-review" *ngIf="authService.isLoggedIn">
          <h3>Write a Review</h3>
          <div class="star-selector">
            <span
              *ngFor="let s of [1,2,3,4,5]"
              [class.selected]="newRating >= s"
              (click)="newRating = s"
            >★</span>
          </div>
          <textarea [(ngModel)]="newComment" placeholder="Share your experience..."></textarea>
          <button class="btn-submit-review" (click)="submitReview()">Submit Review</button>
        </div>

        <div class="reviews-list" *ngIf="product.reviews?.length">
          <div class="review-item" *ngFor="let review of product.reviews">
            <div class="review-header">
              <span class="reviewer-avatar">{{ review.name[0] }}</span>
              <div>
                <strong>{{ review.name }}</strong>
                <div class="review-stars">{{ getStars(review.rating) }}</div>
              </div>
              <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>

        <div class="no-reviews" *ngIf="!product.reviews?.length">
          <p>No reviews yet. Be the first to review!</p>
        </div>
      </div>
    </div>

    <div class="loading-state" *ngIf="loading">
      <div class="spinner"></div><p>Loading product...</p>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedImage = '';
  quantity = 1;
  newRating = 5;
  newComment = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(id).subscribe({
      next: p => { this.product = p; this.selectedImage = p.images[0]; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/products']); }
    });
  }

  addToCart() {
    if (!this.product) return;
    this.cartService.addToCart(this.product._id, this.quantity).subscribe();
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  submitReview() {
    if (!this.product) return;
    this.productService.addReview(this.product._id, this.newRating, this.newComment).subscribe({
      next: () => {
        this.newComment = '';
        this.newRating = 5;
        this.productService.getProduct(this.product!._id).subscribe(p => this.product = p);
      }
    });
  }

  getStars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  getDiscount(): number {
    if (!this.product?.originalPrice) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }
}
