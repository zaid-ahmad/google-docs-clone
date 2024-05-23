const mongoose = require("mongoose");
const Document = require("./Document");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://google-docs-clone-zaid.vercel.app",
        methods: ["GET", "POST"],
    },
});

app.use(
    cors({
        origin: "https://google-docs-clone-zaid.vercel.app",
        methods: ["GET", "POST"],
    })
);

app.get("/", (req, res) => {
    res.write(`<h1>Socket IO Start on Port: ${PORT}</h1>`);
    res.end();
});

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

const defaultValue = "";

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("get-document", async (documentId) => {
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.data);

        socket.on("send-changes", (delta) => {
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });

        socket.on("save-document", async (data) => {
            await Document.findByIdAndUpdate(documentId, { data });
        });
    });
});

async function findOrCreateDocument(id) {
    if (id == null) return;
    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: defaultValue });
}

server.listen(PORT, () => {
    console.log("listening on *:3000");
});
