import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { OrdersService } from '@dashboard/services/orders.service';
import { Orders } from './orders';

describe('Orders', () => {
  let component: Orders;
  let fixture: ComponentFixture<Orders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orders],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            getOrders: () =>
              of({
                success: true,
                message: 'ok',
                data: {
                  items: [],
                  pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
                },
              }),
            getOrderById: () => of({ success: true, message: 'ok', data: null }),
            updateStatus: () => of({ success: true, message: 'ok', data: null }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Orders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
