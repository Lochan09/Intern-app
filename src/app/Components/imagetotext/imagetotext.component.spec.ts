import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagetotextComponent } from './imagetotext.component';

describe('ImagetotextComponent', () => {
  let component: ImagetotextComponent;
  let fixture: ComponentFixture<ImagetotextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagetotextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagetotextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
