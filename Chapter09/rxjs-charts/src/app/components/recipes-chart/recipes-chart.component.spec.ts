import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesChartComponent } from './recipes-chart.component';

describe('RecipesChartComponent', () => {
  let component: RecipesChartComponent;
  let fixture: ComponentFixture<RecipesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipesChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
