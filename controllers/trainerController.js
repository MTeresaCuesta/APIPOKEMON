const connection = require("../config/db");
const bcrypt = require("bcrypt");
class TrainerController {
  // Muestra a todos los entrenadores
  getAllTrainer = (req, res) => {
    let sql = `SELECT * FROM trainer WHERE is_deleted = 0`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.render("allTrainers", { result });
    });
  };
  //   Muestra el formulario de registro
  viewRegisterForm = (req, res) => {
    res.render("register", { message: "" });
  };
  //   Registra un nuevo entrenador
  register = (req, res) => {
    let { name, email, password } = req.body;
    let img = "";
    if (req.file != undefined) {
      img = req.file.filename;
    } else {
      img = "avatar.png";
    }
    // Encriptamos contraseña
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) throw err;
      //   console.log(hash);
      let sql = `INSERT INTO trainer (name, email, password, photo) VALUES ("${name}", "${email}", "${hash}", "${img}")`;
      connection.query(sql, (error, result) => {
        console.log(error);
        // si da error
        if (error) {
          // si el error es por email duplicado
          if (error.code == "ER_DUP_ENTRY") {
            res.render("register", { message: "El email ya existe" });
          } else {
            // si es otro tipo de error
            throw error;
          }
        } else {
          // si no da error
          res.render("register", {
            message: "Entrenador creado correctamente",
          });
        }
      });
    });
  };
  //   Muestra la vista de perfil de un entrenador con sus pokemon
  viewOneTrainer = (req, res) => {
    let trainer_id = req.params.id;
    let sqlTrainer = `SELECT * FROM trainer WHERE is_deleted = 0 AND trainer_id = ${trainer_id}`;
    let sqlPokemon = `SELECT * FROM pokemon WHERE is_deleted = 0 AND trainer_id = ${trainer_id}`;
    connection.query(sqlTrainer, (errorTrainer, resultTrainer) => {
      if (errorTrainer) throw errorTrainer;
      connection.query(sqlPokemon, (errorPokemon, resultPokemon) => {
        if (errorPokemon) throw errorPokemon;
        res.render("oneTrainer", { resultTrainer, resultPokemon });
      });
    });
  };
  // Muestra la vista de perfil de un entrenador con sus obras con una sola consulta a la base de datos
  viewOtherOneTrainer = (req, res) => {
    let trainer_id = req.params.id;
    let sql = `SELECT trainer.*,  pokemon.is_deleted as deleted, pokemon.pokemon_id, pokemon.pokemon_name, pokemon.type, pokemon.pokemon_img from trainer left join pokemon on trainer.trainer_id = pokemon.trainer_id WHERE trainer.trainer_id = ${trainer_id} AND trainer.is_deleted = 0;`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
      console.log(result);
      //   limpiamos el resultado
      let finalResult = {};
      let pokemonGroup = [];
      let pokemon = {};
      result.forEach((x) => {
        if (x.deleted == 0) {
          pokemon = {
            pokemon_id: x.pokemon_id,
            pokemon_name: x.pokemon_name,
            type: x.type,
            pokemon_img: x.pokemon_img,
          };
          pokemonGroup.push(pokemon);
        }
      });
      finalResult = {
        trainer_id: trainer_id,
        name: result[0].name,
        // trainer_name: result[0].trainer_name,
        photo: result[0].photo,
        email: result[0].email,
        password: result[0].password,
        pokemonGroup,
      };
      res.render("otherOneTrainer", { finalResult });
    });
  };
}
module.exports = new TrainerController();