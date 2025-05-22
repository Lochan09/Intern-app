import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AisupportComponent } from './aisupport.component';

describe('AisupportComponent', () => {
  let component: AisupportComponent;
  let fixture: ComponentFixture<AisupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AisupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AisupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
