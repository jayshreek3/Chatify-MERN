const express = require("express");
const colors = require("colors");
const { chats } = require("./data/data");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const {notFound, errorHandler} = require('./middleware/errorMiddleware')

dotenv.config();

connectDB();


app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server started on port ${PORT}`.blue.italic));
