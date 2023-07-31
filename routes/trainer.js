var express = require("express");
const trainerController = require("../controllers/trainerController");
const uploadImage = require("../middleware/multer");
var router = express.Router();

// Ruta base : localhost:3000/trainer

// Muestra todos los trainers
// localhost:3000/trainer
router.get("/", trainerController.getAllTrainer);

// Muestra el formulario de registro
// localhost:3000/trainer/register
router.get("/register", trainerController.viewRegisterForm);

// Guarda los datos de un nuevo trainer
// localhost:3000/trainer/register
router.post("/register", uploadImage("trainers"), trainerController.register);

// Muestra la vista de perfil de un trainer con sus pokemon
// localhost:3000/trainer/oneTrainer/:id
router.get("/oneTrainer/:id", trainerController.viewOneTrainer);

// Muestra la vista de perfil de un trainer con sus pokemon con una sola consulta a la base de datos
// localhost:3000/trainer/otherOneTrainer/:id
router.get("/otherOneTrainer/:id", trainerController.viewOtherOneTrainer);

module.exports = router;