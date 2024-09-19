import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DndFileUploadComponent } from './dnd-file-upload.component';

describe('DndFileUploadComponent', () => {
  let component: DndFileUploadComponent;
  let fixture: ComponentFixture<DndFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DndFileUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DndFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
