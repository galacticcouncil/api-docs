import {ReactiveController, ReactiveControllerHost} from 'lit';
import type {Cursor} from '@thi.ng/atom/cursor';

export class DatabaseController<T> implements ReactiveController {
  private readonly host: ReactiveControllerHost;
  private watchId: string;
  private cursor: Cursor<T>;

  state: T = null;

  constructor(
    host: ReactiveControllerHost,
    watchId: string,
    cursor: Cursor<T>
  ) {
    this.state = cursor.deref();
    this.host = host;
    this.watchId = watchId;
    this.cursor = cursor;
    host.addController(this);
  }

  hostConnected() {
    this.cursor.addWatch(this.watchId, (id, prev, curr) => {
      this.state = curr;
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.cursor.removeWatch(this.watchId);
  }
}
