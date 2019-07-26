import express from "express";
import { CompanyAmountDetails } from '../middleware/impact';

const app = express.Router();

app.post("/:apiType", (req, res) => {
    CompanyAmountDetails(req, (err, resp) => {
        if (err) return res.send(err);
        res.send(resp)
    })
})

module.exports = app;