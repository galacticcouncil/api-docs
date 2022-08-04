import {ReactiveController, ReactiveControllerHost} from 'lit';

import {db, State} from '../db';

const WATCH_ID = 'Chain info';

export class DashboardController implements ReactiveController {
  private readonly host: ReactiveControllerHost;

  data: State = null;

  constructor(host: ReactiveControllerHost) {
    this.data = db.deref();
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    db.addWatch(WATCH_ID, (id, prev, curr) => {
      this.data = curr;
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    db.removeWatch(WATCH_ID);
  }
}
