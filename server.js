require('dotenv').config();
const express = require('express');
const cors = require('cors');

const eventsRouter = require('./routes/events');
const booksRouter = require('./routes/books');
const newsRouter = require('./routes/news');
const contactRouter = require('./routes/contact');
const adminsRouter = require('./routes/admins');
const bookCategoriesRouter = require('./routes/bookCategories');
const eventCategoriesRouter = require('./routes/eventCategories');
const authenticateToken = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());



// Rutas públicas
app.use('/api/admins', adminsRouter); // registro y login


// Rutas públicas (GET)
app.use('/api/books', booksRouter);
app.use('/api/events', eventsRouter);
app.use('/api/news', newsRouter);
app.use('/api/book-categories', bookCategoriesRouter);
app.use('/api/event-categories', eventCategoriesRouter);
app.use('/api/contact', contactRouter); // contacto es público

app.get('/', (req, res) => {
  res.send('API Dinámica de Sistemas funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
