const Task = require('../models/Task');

// Create New Task
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        const newTask = new Task({
            title,
            description,
            user: req.user.id //middleware id
        });

        await newTask.save();
        res.status(201).json({ message: "Task Created Successfully!", newTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Tasks of Logged-in User
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};