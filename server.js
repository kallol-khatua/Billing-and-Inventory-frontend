import express from 'express';
const app = express();
import cors from 'cors'
import path from 'path'

app.use(cors());

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "./dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})