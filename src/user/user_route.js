const express = require("express");
const router = express.Router();
const userController = require("./user_controller");

router.get("/users/list",userController.index); 
router.get("/users/show/:id",userController.show); 
router.post("/users/store",userController.store ); 
router.post("/users/login",userController.Login ); 
router.put("/users/update",userController.update); 
router.delete("/users/delete/:id",userController.deleted); 

module.exports = router;
