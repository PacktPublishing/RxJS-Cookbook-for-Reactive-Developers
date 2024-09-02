import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterOutletComponent } from './router-outlet.component';

describe('RouterOutletComponent', () => {
  let component: RouterOutletComponent;
  let fixture: ComponentFixture<RouterOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterOutletComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RouterOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
