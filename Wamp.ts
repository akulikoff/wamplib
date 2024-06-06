import WebSocket from "ws";

type WampMessage = [number, ...any[]];

class WAMP {
  private url: string;
  private ws: WebSocket | null;
  private sessionId: string | null;
  private callId: string | null;
  private heartbeatCounter: number;
  private isConnected: boolean;

  constructor(url: string) {
    this.url = url;
    this.ws = null;
    this.sessionId = null;
    this.callId = null;
    this.heartbeatCounter = 0;
    this.isConnected = false;
  }

  async connect(): Promise<void> {
    this.ws = new WebSocket(this.url);

    await new Promise<void>((resolve, reject) => {
      this.ws!.onopen = () => {
        if (this.ws!.readyState === WebSocket.OPEN) {
          this.isConnected = true;
          resolve();
        } else {
          reject(new Error("WebSocket connection failed"));
        }
      };

      this.ws!.onerror = (error) => {
        reject(error);
      };
    });

    this.ws.onmessage = (event: WebSocket.MessageEvent) =>
      this.onMessage(event);
    this.ws.onclose = () => {
      this.isConnected = false;
    };
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  private onMessage(event: WebSocket.MessageEvent): void {
    const message: WampMessage = JSON.parse(event.data.toString());
    const messageType = message[0];

    switch (messageType) {
      case 0: // Welcome
        this.sessionId = message[1];
        console.log(`Welcome message received. Session ID: ${this.sessionId}`);
        break;
      case 3: // CallResult
        console.log(
          `Call result received. Call ID: ${message[1]}, Result: ${message[2]}`
        );
        break;
      case 4: // CallError
        console.log(
          `Call error received. Call ID: ${message[1]}, Error URI: ${message[2]}, Error Desc: ${message[3]}, Error Details: ${message[4]}`
        );
        break;
      case 8: // Event
        console.log(`Event received. URI: ${message[1]}, Event: ${message[2]}`);
        break;
      case 20: // Heartbeat
        console.log(`Heartbeat received. Counter: ${message[1]}`);
        break;
      default:
        console.log("Unknown message type");
    }
  }

  async call(uri: string, ...args: any[]): Promise<void> {
    await this.ensureConnected();
    this.callId = this.generateId();
    const message = JSON.stringify([2, this.callId, uri, ...args]);
    console.log(message);
    this.ws!.send(message);
  }

  async subscribe(uri: string): Promise<void> {
    await this.ensureConnected();
    const message = JSON.stringify([5, uri]);
    this.ws!.send(message);
  }

  async unsubscribe(uri: string): Promise<void> {
    await this.ensureConnected();
    const message = JSON.stringify([6, uri]);
    this.ws!.send(message);
  }

  async heartbeat(): Promise<void> {
    await this.ensureConnected();
    const message = JSON.stringify([20, this.heartbeatCounter++]);
    this.ws!.send(message);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 16);
  }
}

export default WAMP;
