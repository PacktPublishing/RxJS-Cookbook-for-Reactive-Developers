import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBtnComponent } from './progress-btn.component';

describe('ProgressBtnComponent', () => {
  let component: ProgressBtnComponent;
  let fixture: ComponentFixture<ProgressBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgressBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
