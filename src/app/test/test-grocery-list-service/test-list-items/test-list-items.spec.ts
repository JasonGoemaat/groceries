import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestListItems } from './test-list-items';

describe('TestListItems', () => {
  let component: TestListItems;
  let fixture: ComponentFixture<TestListItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestListItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestListItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
