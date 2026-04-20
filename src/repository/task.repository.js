import TaskModel from "../models/task.model.js";

class TaskRepository {
    async create(workspace_id, title, description, subtasks, user_id) {
        return await TaskModel.create({
            workspace_id,
            title,
            description,
            subtasks,
            created_by: user_id
        });
    }

    async getTasksByWorkspaceId(workspace_id) {
        return await TaskModel.find({ workspace_id }).sort({ created_at: -1 });
    }

    async getById(task_id) {
        return await TaskModel.findById(task_id);
    }

    async updateById(task_id, updateData) {
        return await TaskModel.findByIdAndUpdate(task_id, updateData, { new: true });
    }

    async deleteById(task_id) {
        await TaskModel.findByIdAndDelete(task_id);
    }
}

const taskRepository = new TaskRepository();
export default taskRepository;
