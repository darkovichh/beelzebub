import { Server } from "socket.io";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("sendMessage", async (data) => {
        await dbConnect();

        const saved = await Message.create({
          text: data.text,
          username: data.username || "Anonymous"
        });

        io.emit("receiveMessage", saved);
      });
    });
  }
  res.end();
}