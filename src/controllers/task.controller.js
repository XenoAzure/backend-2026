import taskRepository from "../repository/task.repository.js";
import ServerError from "../helpers/error.helper.js";

class TaskController {
    async createTask(request, response) {
        try {
            const { workspace_id } = request.params;
            const { title, description, subtasks } = request.body;
            const user_id = request.user.id;

            if (!title) {
                return response.status(400).json({ ok: false, status: 400, message: "El título es obligatorio" });
            }

            const task = await taskRepository.create(workspace_id, title, description || '', subtasks || [], user_id);

            return response.status(201).json({
                ok: true, status: 201, message: "Task created successfully", data: { task }
            });
        } catch (error) {
            console.error("Error in createTask", error);
            return response.status(500).json({ ok: false, status: 500, message: "Internal server error" });
        }
    }

    async getTasks(request, response) {
        try {
            const { workspace_id } = request.params;
            const tasks = await taskRepository.getTasksByWorkspaceId(workspace_id);

            return response.status(200).json({
                ok: true, status: 200, message: "Tasks retrieved successfully", data: { tasks }
            });
        } catch (error) {
            console.error("Error in getTasks", error);
            return response.status(500).json({ ok: false, status: 500, message: "Internal server error" });
        }
    }

    async updateTask(request, response) {
        try {
            const { task_id } = request.params;
            const updateProps = request.body;

            const task = await taskRepository.updateById(task_id, updateProps);

            return response.status(200).json({
                ok: true, status: 200, message: "Task updated successfully", data: { task }
            });
        } catch (error) {
            console.error("Error in updateTask", error);
            return response.status(500).json({ ok: false, status: 500, message: "Internal server error" });
        }
    }

    async deleteTask(request, response) {
        try {
            const { task_id } = request.params;
            await taskRepository.deleteById(task_id);

            return response.status(200).json({
                ok: true, status: 200, message: "Task deleted successfully"
            });
        } catch (error) {
            console.error("Error in deleteTask", error);
            return response.status(500).json({ ok: false, status: 500, message: "Internal server error" });
        }
    }
}

const taskController = new TaskController();
export default taskController;
