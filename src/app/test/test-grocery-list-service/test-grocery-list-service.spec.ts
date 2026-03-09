import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGroceryListService } from './test-grocery-list-service';

describe('TestGroceryListService', () => {
  let component: TestGroceryListService;
  let fixture: ComponentFixture<TestGroceryListService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGroceryListService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestGroceryListService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
