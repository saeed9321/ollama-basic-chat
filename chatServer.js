import express from "express";
import cors from "cors";
import { join, resolve } from "path";

const app = express();
app.use(cors());
const port = 54321;

// Render ReactJS form ExpressJS
app.use(express.static(join(resolve(), "dist")));
app.use("/", (req, res) => {
	console.log("Loading React JS");
	res.sendFile(join(resolve(), "dist", "index.html"));
});

app.listen(port, () =>
	console.log("> Server is up and running on port : " + port)
);
