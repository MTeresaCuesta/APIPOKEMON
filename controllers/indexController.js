class IndexController {
  // Muestra la vista home
  viewHome = (req, res) => {
    res.render("index", { title: "Express" });
  };
}
module.exports = new IndexController();
