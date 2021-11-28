var express = require("express");
var app = express();
const PORT = 3000;
var hbs = require("express-handlebars");
var path = require("path");
const Datastore = require("nedb");

const coll1 = new Datastore({
  filename: "auta.db",
  autoload: true,
});

app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine("hbs", hbs({ defaultLayout: "main.hbs" })); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs");
app.get("/", function (req, res) {
  coll1.find({}, function (err, docs) {
    // //zwracam dane w postaci JSON
    // console.log("----- tablica obiektów pobrana z bazy: \n");

    const data = { docs };
    //console.log(data);

    res.render("form.hbs", data);
  }); // nie podajemy ścieżki tylko nazwę pliku // res.render('index.hbs', { layout: "main.hbs" }); // opcjonalnie podajemy konkretny layout dla tego widoku
});

app.get("/handle", function (req, res) {
  let obj = {
    a: req.query.ubez == "on" ? "TAK" : "NIE",
    b: req.query.benz == "on" ? "TAK" : "NIE",
    c: req.query.uszk == "on" ? "TAK" : "NIE",
    d: req.query.nap == "on" ? "TAK" : "NIE",
  };
  let base = { obj };
  //console.log(coll1);
  coll1.insert(base, function (err, newDoc) {
    //console.log(newDoc);
  });
  coll1.find({}, function (err, docs) {
    // //zwracam dane w postaci JSON
    // console.log("----- tablica obiektów pobrana z bazy: \n");
    data = { docs };
    res.render("form.hbs", data);
    // console.log("----- sformatowany z wcięciami obiekt JSON: \n");
  });
});
app.get("/delete", function (req, res) {
  const toDelete = req.query.delete;

  coll1.remove({ _id: toDelete }, {}, function (err, numRemoved) {
    console.log("usunięto dokumentów: ", numRemoved);
  });

  coll1.find({}, function (err, docs) {
    data = { docs };

    res.render("form.hbs", data);
  });
});

app.get("/update", function (req, res) {
  const toUpdate = req.query.update.split("_");

  let obj = {
    a: toUpdate[1],
    b: toUpdate[2],
    c: toUpdate[3],
    d: toUpdate[4],
  };
  let newBase = { obj };
  console.log(newBase);
  console.log(newBase);
  coll1.update(
    { _id: toUpdate[0] },
    { $set: newBase },
    {},
    function (err, numUpdated) {
      console.log("zaktualizowano " + numUpdated);
    }
  );

  coll1.find({}, function (err, docs) {
    // //zwracam dane w postaci JSON
    // console.log("----- tablica obiektów pobrana z bazy: \n");
    data = { docs };
    res.render("form.hbs", data);
    // console.log("----- sformatowany z wcięciami obiekt JSON: \n");
  });
});
app.use(express.static("static"));
app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
