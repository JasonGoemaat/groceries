import { TestBed } from '@angular/core/testing';
import { Groceries, GroceryListsKey } from './groceries';
import { vi } from 'vitest';

describe('Groceries', () => {
  let service: Groceries;
  let storage: any;

  afterEach(() => {
    localStorage.clear();
  })

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Groceries);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use confirm and clear on error', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    localStorage.setItem(GroceryListsKey, 'THIS IS NOT JSON');

    // this works mocking the item call to check if it is used
    // const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => 'THIS IS NOT JSON');
    service.fetchLists().then((lists) => {
      // expect(getItem).toHaveBeenCalledWith(GroceryListsKey);
      expect(confirm).toHaveBeenCalled();
      expect(lists).toEqual([]);
    });
  });

  it('should use confirm and throw error on no', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    localStorage.setItem(GroceryListsKey, 'THIS IS NOT JSON');

    expect(async () => {
      const lists = await service.fetchLists();
    }).rejects.toThrow();
    expect(confirm).toHaveBeenCalled();
  });

  it('should return list from localStorage', () => {
    const list = [{ name: 'Test List', createdAt: new Date(), modifiedAt: new Date(), items: ['item1', 'item2'] }];
    localStorage.setItem(GroceryListsKey, JSON.stringify(list));
    service.fetchLists().then((lists) => {
      expect(JSON.stringify(lists)).toEqual(JSON.stringify(list));
    });
  });

  it('should update localStorage with changes', () => {
    const lists = [{ name: 'Test List', description: '', created: new Date(), modified: new Date(), items: ['item1', 'item2'] }];
    service.saveLists(lists).then(() => {
      const stored = localStorage.getItem(GroceryListsKey);
      expect(stored).toEqual(JSON.stringify(lists));
    });
  });


  it('should handle parsing dates', () => {
    const list = [{ name: 'Test List', createdAt: new Date(), modifiedAt: new Date(), items: ['item1', 'item2'] }];
    localStorage.setItem(GroceryListsKey, JSON.stringify(list));
    service.fetchLists().then((lists) => {
      expect(typeof lists[0].created).toEqual('object');
    });
  });
});
