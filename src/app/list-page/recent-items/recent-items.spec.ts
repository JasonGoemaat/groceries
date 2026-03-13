import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentItems } from './recent-items';

describe('RecentItems', () => {
  let component: RecentItems;
  let fixture: ComponentFixture<RecentItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
