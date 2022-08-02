import {ReactiveController, ReactiveControllerHost} from 'lit';

import {db} from '../db';

const WATCH_ID = 'Chain';

export class HomeController implements ReactiveController {
  private readonly host: ReactiveControllerHost;

  data = {};

  constructor(host: ReactiveControllerHost) {
    this.data = db.deref();
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    db.addWatch(WATCH_ID, (id, prev, curr) => {
      console.log(curr);
      this.data = curr;
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    db.removeWatch(WATCH_ID);
  }
}
