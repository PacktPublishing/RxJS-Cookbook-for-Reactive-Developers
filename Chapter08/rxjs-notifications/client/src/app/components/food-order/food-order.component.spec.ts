import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodOrderComponent } from './food-order.component';

describe('FoodOrderComponent', () => {
  let component: FoodOrderComponent;
  let fixture: ComponentFixture<FoodOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoodOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
