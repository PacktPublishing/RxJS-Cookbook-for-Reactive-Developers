import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabContent2Component } from './tab-content2.component';

describe('TabContent2Component', () => {
  let component: TabContent2Component;
  let fixture: ComponentFixture<TabContent2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabContent2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabContent2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
