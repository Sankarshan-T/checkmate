
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@checkmate/tasks';

export type Task = {
    id: string;
    title: string;
    completed: boolean;
    completionHistory: string[];
};

export async function loadTasks(): Promise<Task[]> {
    try {
        const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

        if (savedTasks === null) {
            return [];
        }

        const parsedTasks: unknown = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks.map(task => ({
            ...task,
            completionHistory: Array.isArray(task.completionHistory)
                ? task.completionHistory
                : [],
        })) as Task[];
    } catch (error) {
        console.error('Failed to load tasks:', error);
        return [];
    }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
    try {
        await AsyncStorage.setItem(
            TASKS_STORAGE_KEY,
            JSON.stringify(tasks),
        );
    } catch (error) {
        console.error('Failed to save tasks:', error);
        throw error;
    }
}
