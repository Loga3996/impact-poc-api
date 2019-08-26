import express from "express";
import { cartOrdersDetails } from '../middleware/impact';

const app = express.Router();

app.post("/:apiType", (req, res) => {
    cartOrdersDetails(req, (err, resp) => {
        if (err) return res.send(err);
        res.send(resp)
    })
})

module.exports = app;