import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BouncingBallComponent } from './bouncing-ball.component';

describe('BouncingBallComponent', () => {
  let component: BouncingBallComponent;
  let fixture: ComponentFixture<BouncingBallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BouncingBallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BouncingBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
