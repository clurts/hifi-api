const jsonServer = require("json-server-relationship");
const auth = require("json-server-auth");

const app = jsonServer.create();
const router = jsonServer.router("db.json");

const port = process.env.PORT || 4000;

// /!\ Bind the router db to the app
app.db = router.db;

// Make sure to use the default middleware
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(jsonServer.bodyParser);

const rules = auth.rewriter({
  // Permission rules
  users: 600,
  secrets: 660,
});

// You must apply the auth middleware before the router
app.use(rules);
app.use(auth);

// Rewrite /products/:slug to /products?slug=:slug
app.get("/products/:slug", (req, res, next) => {
  const slug = req.params.slug;
  req.url = `/products?slug=${slug}`;
  next();
});


app.use(router);
app.listen(port, () => {
  console.log("Server is ready for requests on port " + port);
});

module.exports = app;
