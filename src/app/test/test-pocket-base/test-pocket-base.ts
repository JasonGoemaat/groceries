import { Component } from '@angular/core';
import { DataService } from '../../data-service';
import PocketBase from "pocketbase";

@Component({
  selector: 'app-test-pocket-base',
  imports: [],
  templateUrl: './test-pocket-base.html',
  styleUrl: './test-pocket-base.css',
  providers: [DataService],
})
export class TestPocketBase {
  public pb: PocketBase;
  protected unsub: any;

  constructor(public dataService: DataService) {
    this.pb = dataService.pb;

    // this.pb.collection("lists").subscribe(1, 50, {}).then((result) => {
    //   console.log(result);
    // }).catch((error) => {
    //   console.error(error);
    // });
  }

  ngOnInit() {
    this.unsub = this.pb.collection("lists").
      subscribe("*", (result) => {
        console.log('lists:', result);
      }, {
        filter: "",
      }).catch((error) => {
        console.error(error);
      });
    console.log('subscribed, wait for lists')
  }

  ngOnDestroy() {
    if (this.unsub) {
      console.log('unsubscribing from lists');
      this.unsub();
    }
  }
}
