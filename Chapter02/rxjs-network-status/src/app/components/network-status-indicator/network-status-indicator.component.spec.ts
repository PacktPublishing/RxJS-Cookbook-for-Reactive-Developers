import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkStatusIndicatorComponent } from './network-status-indicator.component';

describe('NetworkStatusIndicatorComponent', () => {
  let component: NetworkStatusIndicatorComponent;
  let fixture: ComponentFixture<NetworkStatusIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkStatusIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetworkStatusIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
