import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TGLSGroceryList } from './tglsgrocery-list';

describe('TGLSGroceryList', () => {
  let component: TGLSGroceryList;
  let fixture: ComponentFixture<TGLSGroceryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGLSGroceryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TGLSGroceryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
