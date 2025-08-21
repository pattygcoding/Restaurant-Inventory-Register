import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MenuItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<MenuItem[]> {
    if (environment.useMockApi) {
      return this.getMockMenuItems();
    }

    return this.http.get<MenuItem[]>(`${this.baseUrl}/menu`);
  }

  getMenuItem(id: string): Observable<MenuItem> {
    if (environment.useMockApi) {
      return this.getMockMenuItem(id);
    }

    return this.http.get<MenuItem>(`${this.baseUrl}/menu/${id}`);
  }

  private getMockMenuItems(): Observable<MenuItem[]> {
    const mockMenuItems: MenuItem[] = [
      // Entrées
      {
        id: '1',
        name: 'Hamburger',
        category: 'ENTREE',
        basePrice: 8.99,
        optionsJson: '{}',
        isTopping: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Cheeseburger',
        category: 'ENTREE',
        basePrice: 9.99,
        optionsJson: '{}',
        isTopping: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Hot Dog',
        category: 'ENTREE',
        basePrice: 6.99,
        optionsJson: '{}',
        isTopping: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Sides
      {
        id: '4',
        name: 'Fries (Regular)',
        category: 'SIDE',
        basePrice: 3.99,
        optionsJson: '{}',
        isTopping: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Fries (Extra Large)',
        category: 'SIDE',
        basePrice: 5.99,
        optionsJson: '{}',
        isTopping: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Poutine',
        category: 'SIDE',
        basePrice: 7.99,
        optionsJson: '{}',
        isTopping: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Desserts
      {
        id: '7',
        name: 'Ice Cream',
        category: 'DESSERT',
        basePrice: 4.99,
        optionsJson: '{"flavors": ["Chocolate", "Vanilla", "Strawberry"]}',
        isTopping: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Drinks
      {
        id: '8',
        name: 'Milkshake',
        category: 'DRINK',
        basePrice: 4.99,
        optionsJson: '{"sizes": ["Small", "Medium", "Large"], "flavors": ["Chocolate", "Vanilla", "Strawberry"], "sizePrices": {"Small": 4.99, "Medium": 5.99, "Large": 6.99}}',
        isTopping: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '9',
        name: 'Fountain Drink',
        category: 'DRINK',
        basePrice: 2.99,
        optionsJson: '{"sizes": ["Small", "Medium", "Large"], "sizePrices": {"Small": 2.99, "Medium": 3.49, "Large": 3.99}}',
        isTopping: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Toppings
      {
        id: '10',
        name: 'Extra Patty',
        category: 'TOPPING',
        basePrice: 3.00,
        optionsJson: '{}',
        isTopping: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '11',
        name: 'Bacon',
        category: 'TOPPING',
        basePrice: 2.00,
        optionsJson: '{}',
        isTopping: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '12',
        name: 'Extra Cheese',
        category: 'TOPPING',
        basePrice: 1.00,
        optionsJson: '{}',
        isTopping: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '13',
        name: 'Lettuce',
        category: 'TOPPING',
        basePrice: 0.50,
        optionsJson: '{}',
        isTopping: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '14',
        name: 'Tomatoes',
        category: 'TOPPING',
        basePrice: 0.75,
        optionsJson: '{}',
        isTopping: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '15',
        name: 'Onions',
        category: 'TOPPING',
        basePrice: 0.50,
        optionsJson: '{}',
        isTopping: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return of(mockMenuItems);
  }

  private getMockMenuItem(id: string): Observable<MenuItem> {
    return new Observable<MenuItem>((observer) => {
      this.getMockMenuItems().subscribe(items => {
        const item = items.find(i => i.id === id);
        if (item) {
          observer.next(item);
        } else {
          observer.error({ error: 'Menu item not found' });
        }
        observer.complete();
      });
    });
  }
}