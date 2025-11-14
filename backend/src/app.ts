import express from 'express';
import routes from "./routes";
import cors from 'cors'

const app = express();


app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH",
    allowedHeaders: "Content-Type, Authorization"
}))
app.use(express.json());
app.use("/api", routes)

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

export default app;