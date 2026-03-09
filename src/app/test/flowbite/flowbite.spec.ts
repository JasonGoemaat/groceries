import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flowbite } from './flowbite';

describe('Flowbite', () => {
  let component: Flowbite;
  let fixture: ComponentFixture<Flowbite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flowbite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Flowbite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
