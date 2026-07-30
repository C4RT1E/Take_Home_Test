import { Todo } from '../models/index.js';

// i like tacos

/**
 * Controller to fetch all todos ordered by creation date descending
 */
export const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to create a new todo
 */
export const createTodo = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    let parsedDueDate = null;
    if (dueDate) {
      const d = new Date(dueDate);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: 'Invalid date/time format for deadline' });
      }
      parsedDueDate = d;
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      completed: false,
      dueDate: parsedDueDate
    });

    return res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update an existing todo (partial/full update)
 */
export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed, dueDate } = req.body;

    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      todo.title = title.trim();
    }

    if (description !== undefined) {
      todo.description = description ? description.trim() : null;
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean value' });
      }
      todo.completed = completed;
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') {
        todo.dueDate = null;
      } else {
        const d = new Date(dueDate);
        if (isNaN(d.getTime())) {
          return res.status(400).json({ error: 'Invalid date/time format for deadline' });
        }
        todo.dueDate = d;
      }
    }

    await todo.save();

    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a todo by ID
 */
export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.destroy();

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
