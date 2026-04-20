import mongoose from "mongoose";

const SubTaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    subtasks: [SubTaskSchema],
    created_at: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const TaskModel = mongoose.model('Task', TaskSchema);

export default TaskModel;
