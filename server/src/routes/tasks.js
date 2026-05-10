const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks (Admin see all, Members see assigned)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: req.user.role === 'Admin' ? {} : { assigneeId: req.user.userId },
      include: { project: true, assignee: { select: { name: true } } }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task (Admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: parseInt(projectId),
        assigneeId: assigneeId ? parseInt(assigneeId) : null,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update task status (Admin or Assignee)
router.patch('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'Admin' && task.assigneeId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

module.exports = router;
