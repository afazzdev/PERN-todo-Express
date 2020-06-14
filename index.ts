import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({
  path: __dirname + "/.env",
});

import pool from "./db";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const catchError = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      res.json({ status: "error", err });
    });
  };
};

// Routes

//  Create a todo

type IBody = {
  description: string;
};

app
  .route("/todos")
  .post(
    catchError(
      async (req: Request<IBody>, res: Response): Promise<any> => {
        const { description } = req.body;
        const newTodo = await pool.query(
          "INSERT INTO todo (description) VALUES ($1) RETURNING *",
          [description]
        );

        res.status(201).json({ status: "succes", data: newTodo.rows[0] });
      }
    )
  )
  .get(
    catchError(async (req: Request, res: Response) => {
      const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id");

      res.json({
        status: "success",
        data: allTodos.rows,
      });
    })
  );

app
  .route("/todos/:id")
  .get(
    catchError(async (req: Request, res: Response) => {
      const { id } = req.params;
      const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
        id,
      ]);

      res.json({
        status: "success",
        data: todo.rows[0],
      });
    })
  )
  .put(
    catchError(async (req: Request, res: Response) => {
      const { description } = req.body;
      const { id } = req.params;

      const edited = await pool.query(
        "UPDATE todo SET description = $1 WHERE todo_id = $2",
        [description, id]
      );

      res.json({
        status: "success",
        data: edited.rows[0],
      });
    })
  )
  .delete(
    catchError(async (req: Request, res: Response) => {
      const { id } = req.params;
      await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

      res.json({
        status: "success",
      });
    })
  );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("listening on port 5000");
});
