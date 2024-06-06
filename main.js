"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AppMethods_1 = __importDefault(require("./AppMethods"));
var app = new AppMethods_1.default("ws://test.enter-systems.ru/");
app.login("enter", "A505a");
app.getLogs();
