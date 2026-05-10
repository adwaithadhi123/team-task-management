const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await prisma.project.findMany({
        include: { tasks: true, admin: { select: { name: true } } }
      });
    } else {
      // Members see projects they have tasks in, or all projects?
      // For this simple app, members can see all projects but only edit their assigned tasks.
      projects = await prisma.project.findMany({
        include: { tasks: true, admin: { select: { name: true } } }
      });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project (Admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        adminId: req.user.userId,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

module.exports = router;
