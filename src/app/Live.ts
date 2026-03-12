/*
LiveCollection - proxy for PocketBase collection that allows us to subscribe
to changes and update the UI accordingly.
*/

import { signal, WritableSignal } from "@angular/core";
import { DataService } from "./data-service";
import { RecordModel, RecordSubscription } from "pocketbase";

export interface HasId {
    id: string;
}

export class LiveCollection<T extends HasId> {
    public items: WritableSignal<T[]> = signal([]);
    public loaded: WritableSignal<boolean> = signal(false);

    constructor(
        public dataService: DataService,
        public collectionName: string,
        public filter: string,
    ) {
        this.dataService.pb.collection(this.collectionName)
        .getFullList({
            filter: this.filter,
        }).then((result) => {
            // this.items.set(result.items);
            this.items.set(<T[]>(<unknown>result));
            this.loaded.set(true);
        })

        const updateItem = (data: RecordSubscription<RecordModel>) => {
            const { action, record } = data;
            console.log(`updateItem`, data);
            let newList: T[] | undefined = undefined;
            switch (action) {
                case 'update':
                    newList = this.items().map(x => (x.id === record.id) ? record : x).map(x => <T>x);
                    break;
                case 'delete':
                    newList = this.items().filter(x => x.id !== record.id);
                    break;
                case 'create':
                    newList = [...this.items(), <T>(<unknown>record)];
                    break;
                default:
                    console.error('UNKNOWN ACTION:', action);
                    return;
            }
            if (newList) {
                this.items.set(newList);
            }
        }

        this.dataService.pb.collection(this.collectionName)
        .subscribe("*", updateItem, { filter });
    }
}