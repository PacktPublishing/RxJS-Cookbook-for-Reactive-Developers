import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecipesComponent } from './new-recipes.component';

describe('NewRecipesComponent', () => {
  let component: NewRecipesComponent;
  let fixture: ComponentFixture<NewRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRecipesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
