import {ReactiveController, ReactiveControllerHost} from 'lit';

import {db, State} from './db';

export class DatabaseController implements ReactiveController {
  private readonly host: ReactiveControllerHost;
  private watchId: string;

  state: State = null;

  constructor(host: ReactiveControllerHost, watchId: string) {
    this.state = db.deref();
    this.host = host;
    this.watchId = watchId;
    host.addController(this);
  }

  hostConnected() {
    db.addWatch(this.watchId, (id, prev, curr) => {
      this.state = curr;
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    db.removeWatch(this.watchId);
  }
}
