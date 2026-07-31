import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import http from "http";

dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT || 5000;
connectDB();
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Product routes
app.use('/api/products', productRoutes);
// app.use('/api/workflow',workflowRoutes);
// app.use('/api/profile',profileRoutes);
// app.use('/api/recommend',recommendationRoutes);
app.get("/", (req, res) => {
    res.send("Hello World!");
    // res.json(products);
});

server.listen(port,()=>
{
    console.log(`Server running on port ${port}`);
})


