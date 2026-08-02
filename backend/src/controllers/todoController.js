import prisma from '../lib/prisma.js';

/**
 * Controller to fetch all todos ordered by creation date descending
 */
export const getTodos = async (req, res, next) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
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

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        completed: false,
        dueDate: parsedDueDate
      }
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
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const existingTodo = await prisma.todo.findUnique({
      where: { id: numericId }
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean value' });
      }
      updateData.completed = completed;
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') {
        updateData.dueDate = null;
      } else {
        const d = new Date(dueDate);
        if (isNaN(d.getTime())) {
          return res.status(400).json({ error: 'Invalid date/time format for deadline' });
        }
        updateData.dueDate = d;
      }
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: numericId },
      data: updateData
    });

    return res.status(200).json(updatedTodo);
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
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const existingTodo = await prisma.todo.findUnique({
      where: { id: numericId }
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await prisma.todo.delete({
      where: { id: numericId }
    });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
