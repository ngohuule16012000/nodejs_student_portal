const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { create } = require('express-handlebars');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname,'public')));

// http logger
app.use(morgan('combined'));

const hbs = create({
  extname: '.hbs',
  helpers: {
      foo() { return 'FOO!'; },
      bar() { return 'BAR!'; }
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/sidebar', (req, res) => {
  res.render('sidebardemo');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})