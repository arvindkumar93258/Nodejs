
const express = require("express");
const router = express.Router();

router.get("/:id", async(req, res) => {
    console.log(req);
    const { id } = req.params;
})

router.post("/:id", async(req, res) => {
    console.log(req);
    const { id } = req.params;
})

module.exports = router;
