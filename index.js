const express = require('express');
const cors = require('cors');
require('dotenv').config({
  path: __dirname + '.env',
});
const app = express();
const pool = require('./db');

// Middleware
app.use(cors());
app.use(express.json());

const catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      res.json({ status: 'error', err });
    });
  };
};

// Routes

//  Create a todo

app
  .route('/todos')
  .post(
    catchError(async (req, res) => {
      const { description } = req.body;
      const newTodo = await pool.query(
        'INSERT INTO todo (description) VALUES ($1) RETURNING *',
        [description],
      );

      res.status(201).json({ status: 'succes', data: newTodo.rows[0] });
    }),
  )
  .get(
    catchError(async (req, res) => {
      const allTodos = await pool.query('SELECT * FROM todo ORDER BY todo_id');

      res.json({
        status: 'success',
        data: allTodos.rows,
      });
    }),
  );

app
  .route('/todos/:id')
  .get(
    catchError(async (req, res) => {
      const { id } = req.params;
      const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [
        id,
      ]);

      res.json({
        status: 'success',
        data: todo.rows[0],
      });
    }),
  )
  .put(
    catchError(async (req, res) => {
      const { description } = req.body;
      const { id } = req.params;

      const edited = await pool.query(
        'UPDATE todo SET description = $1 WHERE todo_id = $2',
        [description, id],
      );

      res.json({
        status: 'success',
        data: edited.rows[0],
      });
    }),
  )
  .delete(
    catchError(async (req, res) => {
      const { id } = req.params;
      await pool.query('DELETE FROM todo WHERE todo_id = $1', [id]);

      res.json({
        status: 'success',
      });
    }),
  );

app.listen(5000, () => {
  console.log('listening on port 5000');
});
