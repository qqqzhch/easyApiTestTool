import { Router } from 'express';
import checkGet from './checkGet.js';
const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  // res.render('index', { title: 'Express Babel' });
});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/geturlcheck', async (req, res, next) => {
  const { url } = req.query;

  if (url == null || url === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }
 
 var result = await checkGet(decodeURIComponent(url));


  res.json(result)
});

export default routes;
