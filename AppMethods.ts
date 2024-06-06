import WAMP from "./Wamp";

class AppMethods {
  private wamp: WAMP;

  constructor(url: string) {
    this.wamp = new WAMP(url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.wamp.call("http://enter.local/login", username, password);
  }

  async getLogs(): Promise<void> {
    await this.wamp.subscribe("http://enter.local/logs");
  }

  async logout(): Promise<void> {
    await this.wamp.unsubscribe("http://enter.local/logout");
  }
}

export default AppMethods;
