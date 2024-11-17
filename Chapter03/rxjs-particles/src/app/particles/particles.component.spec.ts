import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticlesComponent } from './particles.component';

describe('ParticlesComponent', () => {
  let component: ParticlesComponent;
  let fixture: ComponentFixture<ParticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticlesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
