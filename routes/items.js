





const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session["user_id"]
    const categoryQuery = `category_id = $2` || ';';
    // // console.log(categoryQuery, req.params.category)
    db.query(`SELECT * FROM items WHERE user_id = $1 ` + categoryQuery, [userID, req.params.category])
      .then(data => {
        const items = data.rows;
        res.render("dashboard", { items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });




  router.post("/", (req, res) => {
    const userID = req.session["user_id"]
    db.query(`SELECT * FROM items WHERE user_id = $1;`, [userID])
      .then(data => {
        const items = data.rows;
        res.render("dashboard", { items });
      })
      .catch(err => {
        res.redirect("/errorpage");
      });
  });


  return router;
};


