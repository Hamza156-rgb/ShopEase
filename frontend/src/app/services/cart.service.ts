import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<Cart>({ items: [] });
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  get cartCount(): number {
    return this.cartSubject.value.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get cartTotal(): number {
    return this.cartSubject.value.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity, 0
    );
  }

  loadCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => this.cartSubject.next(cart || { items: [] }))
    );
  }

  addToCart(productId: string, quantity = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  updateQuantity(productId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/update`, { productId, quantity }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  removeItem(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${productId}`).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      tap(() => this.cartSubject.next({ items: [] }))
    );
  }

  setCart(cart: Cart) {
    this.cartSubject.next(cart);
  }
}
