import express from 'express';
import path from 'path';
import rootRoutes from './routes/root';
const app = express();
const PORT = process.env.PORT || 3500;

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', rootRoutes);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('text').send('404 Not Found');
  }
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
