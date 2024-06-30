import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabContentComponent } from './tab-content.component';

describe('TabContentComponent', () => {
  let component: TabContentComponent;
  let fixture: ComponentFixture<TabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
