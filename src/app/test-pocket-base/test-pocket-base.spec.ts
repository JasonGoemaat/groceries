import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPocketBase } from './test-pocket-base';

describe('TestPocketBase', () => {
  let component: TestPocketBase;
  let fixture: ComponentFixture<TestPocketBase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPocketBase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPocketBase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
