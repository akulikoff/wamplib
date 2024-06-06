import AppMethods from "./AppMethods";

const app = new AppMethods("ws://test.enter-systems.ru/");

app.login("enter", "A505a");
app.getLogs();
