const express = require("express");
var router = express.Router();
var controller = require("../controllers/userController.js");

//***************get request********************** */
router.get("/master", function(req, res){
    res.render("user/master", {
        title : "UserForm"
    });
});

router.get("/signIn", function(req, res){
    res.render("user/signIn", {
        title : "sign-in page"
    });
});

// router.get("/getData", function(req, res){
//     controller.getData(req, res);
// });


router.put("/signInUser", function(req, res){
    controller.signInUser(req, res);
});

//***************put request********************** */
router.put('/addData', function(req, res){
    controller.addData(req, res);
});

module.exports = router;