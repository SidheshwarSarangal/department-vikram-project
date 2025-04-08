const router = require("express").Router();


const userController = require("../controller/userAPI");
const bookController = require("../controller/bookAPI");
const feedbackController = require("../controller/feedbackAPI");


// user api
router.get("/allUser", userController.allUser);
router.post("/register", userController.registerUser);
router.post("/updateUser", userController.updateUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logout);
router.get("/logedinuser", userController.userDetails);
router.get("/userDetail/:id", userController.userDetail);

//books api
router.post("/addBook", bookController.addBook);
router.get("/allBook", bookController.getAllBooks);
router.get("/search/:id", bookController.searchBooks);
router.post("/addToCart", bookController.addToCart);
router.post("/checkout", bookController.checkout);
router.post("/returnBooks", bookController.returnBooks);
router.post("/filter/", bookController.returnBooks);
router.post("/removeFromCart", bookController.removeFromCart);
router.get("/filter/:genre/:year/:title", bookController.filter);
router.get("/booksInCart/:username", bookController.booksInCart);
router.get("/borrowedBooks", bookController.borrowedBooks);
router.get("/allBooksInCart", bookController.allBooksInCart);
router.post("/returnStatusBook", bookController.returnStatusBook);

//feedback
router.post("/addFeedback", feedbackController.addFeedback);
router.delete("/deleteFeedback/:id", feedbackController.removeFeedback);
router.put('/feedbackAccept/:id/', feedbackController.setStatusAcceptedAndClose);
router.put('/feedbackReject/:id/', feedbackController.setStatusRejectedAndClose);
router.get('/getAllFeedbacks', feedbackController.viewAllQuery);
router.get('/getUserFeedbacks/:username', feedbackController.viewUserQuery);
router.put('/makeStatusSubmitted/:id', feedbackController.makeStatusSubmitted);

module.exports = router;