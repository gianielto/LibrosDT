const { Router } = require("express");
import { Request, Response } from "express";
//const pool = require("../db");
const {
  getAllClient,
  getClient,
  createClient,
  deleteClient,
  updateClient,
} = require("../controllers/client.controller");

const router = Router();

router.get("/Client", getAllClient);

router.get("/Client/:id", getClient);

router.post("/Client", createClient);

router.delete("/Client/:id", deleteClient);

router.put("/Client/:id", updateClient);

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Client API");
});

module.exports = router;
