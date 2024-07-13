import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeUnlockComponent } from './swipe-unlock.component';

describe('SwipeUnlockComponent', () => {
  let component: SwipeUnlockComponent;
  let fixture: ComponentFixture<SwipeUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwipeUnlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwipeUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
