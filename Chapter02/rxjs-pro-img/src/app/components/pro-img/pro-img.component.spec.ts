import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProImgComponent } from './pro-img.component';

describe('ProImgComponent', () => {
  let component: ProImgComponent;
  let fixture: ComponentFixture<ProImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProImgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
