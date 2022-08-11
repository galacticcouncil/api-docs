import {ReactiveController, ReactiveControllerHost} from 'lit';
import type {Cursor} from '@thi.ng/atom/cursor';

export class DatabaseController<T> implements ReactiveController {
  private readonly host: ReactiveControllerHost;
  private watchId: string;
  private cursor: Cursor<T>;

  state: T = null;

  constructor(
    host: ReactiveControllerHost,
    cursor: Cursor<T>,
    watchId: string
  ) {
    this.state = cursor.deref();
    this.host = host;
    this.cursor = cursor;
    this.watchId = watchId;
    host.addController(this);
  }

  setKeyValue(key: T): void {
    this.state = key;
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
