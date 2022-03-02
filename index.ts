import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

import type { WebSocket } from "ws";

const port = process.env.PORT || 8080;

const connections: { [id: string]: WebSocket } = {};

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const id = uuidv4();
  console.log(`New connection: ${req.socket.remoteAddress}, ${id}`);

  connections[id] = ws;
  ws.on("message", (data) => {
    console.log(data.toString());
    ws.send("Hello from the cloud!");
  });
  ws.on("close", () => {
    console.log("Lost connection :(");
    delete connections[
      Object.keys(connections).find((key) => connections[key] === ws)
    ];
  });
});

server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
