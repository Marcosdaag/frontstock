import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Managment } from './managment';

describe('Managment', () => {
  let component: Managment;
  let fixture: ComponentFixture<Managment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Managment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Managment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
