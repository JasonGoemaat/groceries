import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroceryList } from './create-grocery-list';

describe('CreateGroceryList', () => {
  let component: CreateGroceryList;
  let fixture: ComponentFixture<CreateGroceryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGroceryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGroceryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
