import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-admin-products',
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 class="admin-brand">⚡ Admin</h2>
        <nav>
          <a routerLink="/admin">📊 Dashboard</a>
          <a routerLink="/admin/products" routerLinkActive="active">📦 Products</a>
          <a routerLink="/admin/orders">🛒 Orders</a>
          <a routerLink="/admin/users">👥 Users</a>
          <a routerLink="/">🏠 Back to Store</a>
        </nav>
      </aside>

      <main class="admin-main">
        <div class="admin-header-row">
          <h1 class="admin-title">Products</h1>
          <button class="btn-primary" (click)="showForm = !showForm">
            {{ showForm ? 'Cancel' : '+ Add Product' }}
          </button>
        </div>

        <!-- Product Form -->
        <div class="admin-form-card" *ngIf="showForm">
          <h2>{{ editingProduct ? 'Edit Product' : 'New Product' }}</h2>
          <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
            <div class="form-row two-col">
              <div class="form-group">
                <label>Name *</label>
                <input type="text" formControlName="name" />
              </div>
              <div class="form-group">
                <label>Category *</label>
                <input type="text" formControlName="category" />
              </div>
            </div>
            <div class="form-group">
              <label>Description *</label>
              <textarea formControlName="description" rows="3"></textarea>
            </div>
            <div class="form-row three-col">
              <div class="form-group">
                <label>Price *</label>
                <input type="number" formControlName="price" step="0.01" />
              </div>
              <div class="form-group">
                <label>Original Price</label>
                <input type="number" formControlName="originalPrice" step="0.01" />
              </div>
              <div class="form-group">
                <label>Stock *</label>
                <input type="number" formControlName="stock" />
              </div>
            </div>
            <div class="form-row two-col">
              <div class="form-group">
                <label>Brand</label>
                <input type="text" formControlName="brand" />
              </div>
              <div class="form-group">
                <label>Image URLs (comma-separated)</label>
                <input type="text" formControlName="images" />
              </div>
            </div>
            <div class="form-group checkbox-group">
              <label><input type="checkbox" formControlName="featured" /> Featured Product</label>
            </div>
            <button type="submit" class="btn-primary" [disabled]="productForm.invalid || saving">
              {{ saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product') }}
            </button>
          </form>
        </div>

        <!-- Products Table -->
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>\${{ product.price.toFixed(2) }}</td>
              <td [class.low-stock]="product.stock < 5">{{ product.stock }}</td>
              <td>
                <button class="btn-edit" (click)="editProduct(product)">Edit</button>
                <button class="btn-delete" (click)="deleteProduct(product._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  showForm = false;
  editingProduct: Product | null = null;
  saving = false;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [null],
      category: ['', Validators.required],
      brand: [''],
      images: [''],
      stock: [0, Validators.required],
      featured: [false]
    });
  }

  ngOnInit() { this.loadProducts(); }

  loadProducts() {
    this.productService.getProducts({ limit: 100 }).subscribe(r => this.products = r.products);
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.showForm = true;
    this.productForm.patchValue({
      ...product,
      images: product.images.join(', ')
    });
  }

  saveProduct() {
    if (this.productForm.invalid) return;
    this.saving = true;
    const data = {
      ...this.productForm.value,
      images: this.productForm.value.images.split(',').map((s: string) => s.trim()).filter(Boolean)
    };

    const obs = this.editingProduct
      ? this.productService.updateProduct(this.editingProduct._id, data)
      : this.productService.createProduct(data);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingProduct = null;
        this.productForm.reset();
        this.loadProducts();
      },
      error: () => { this.saving = false; }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }
}
