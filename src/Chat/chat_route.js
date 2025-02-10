const express = require("express");
const router = express.Router();
const MessageController = require("./chat_controller");

// Message CRUD routes
router.post("/messages", MessageController.store);
router.get("/messages", MessageController.index);
router.get("/messages/:id", MessageController.show);
router.put("/messages/:id", MessageController.update);
router.delete("/messages/:id", MessageController.deleted);

module.exports = router;
