import AsyncStorage from '@react-native-async-storage/async-storage';

const LEGACY_TASKS_STORAGE_KEY = '@checkmate/tasks';
const GLOBAL_TASKS_STORAGE_KEY = '@checkmate/globalTasks';
const DAILY_TASKS_STORAGE_KEY = '@checkmate/dailyTasks';
const REMOVED_TASK_HISTORY_KEY = '@checkmate/removedTaskHistory';

export type GlobalTask = {
    id: string;
    title: string;
    completionHistory: string[];
};

export type DailyTask = {
    id: string;
    title: string;
    date: string;
    completed: boolean;
};

export type DailyTaskAssignment = {
    taskId: string;
    date: string;
    completed: boolean;
};

export type Task = {
    id: string;
    title: string;
    completed: boolean;
    completionHistory: string[];
};

export type TaskStorageData = {
    globalTasks: GlobalTask[];
    dailyTasks: DailyTask[];
    assignments: DailyTaskAssignment[];
};

export type RemovedTaskHistory = {
    taskId: string;
    title: string;
    completionHistory: string[];
};

const isRecord = (
    value: unknown,
): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null;
};

const isStringArray = (value: unknown): value is string[] => {
    return (
        Array.isArray(value) &&
        value.every(item => typeof item === 'string')
    );
};

const isGlobalTask = (value: unknown): value is GlobalTask => {
    return (
        isRecord(value) &&
        typeof value.id === 'string' &&
        typeof value.title === 'string' &&
        isStringArray(value.completionHistory)
    );
};

const isDailyTask = (value: unknown): value is DailyTask => {
    return (
        isRecord(value) &&
        typeof value.id === 'string' &&
        typeof value.title === 'string' &&
        typeof value.date === 'string' &&
        typeof value.completed === 'boolean'
    );
};

const isAssignment = (
    value: unknown,
): value is DailyTaskAssignment => {
    return (
        isRecord(value) &&
        typeof value.taskId === 'string' &&
        typeof value.date === 'string' &&
        typeof value.completed === 'boolean'
    );
};

const isLegacyTask = (value: unknown): value is Task => {
    return (
        isRecord(value) &&
        typeof value.id === 'string' &&
        typeof value.title === 'string' &&
        typeof value.completed === 'boolean'
    );
};

const parseArray = (raw: string, key: string): unknown[] => {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
        throw new Error(`Invalid saved data for ${key}.`);
    }

    return parsed;
};

export async function migrateTaskStorage(): Promise<void> {
    const [globalRaw, dailyRaw, legacyRaw] = await Promise.all([
        AsyncStorage.getItem(GLOBAL_TASKS_STORAGE_KEY),
        AsyncStorage.getItem(DAILY_TASKS_STORAGE_KEY),
        AsyncStorage.getItem(LEGACY_TASKS_STORAGE_KEY),
    ]);

    if (globalRaw !== null || dailyRaw !== null) {
        return;
    }

    const legacyTasks: Task[] = legacyRaw === null
        ? []
        : parseArray(legacyRaw, LEGACY_TASKS_STORAGE_KEY).map(
            (item): Task => {
                if (!isLegacyTask(item)) {
                    throw new Error('An existing task has invalid data.');
                }

                return {
                    id: item.id,
                    title: item.title,
                    completed: item.completed,
                    completionHistory: isStringArray(
                        item.completionHistory,
                    )
                        ? item.completionHistory
                        : [],
                };
            },
        );

    const globalTasks: GlobalTask[] = legacyTasks.map(task => ({
        id: task.id,
        title: task.title,
        completionHistory: [...task.completionHistory],
    }));

    const assignments: DailyTaskAssignment[] = [];
    const today = getLocalDateKey(new Date());

    for (const task of legacyTasks) {
        for (const date of new Set(task.completionHistory)) {
            assignments.push({
                taskId: task.id,
                date,
                completed: true,
            });
        }

        if (!assignments.some(
            assignment =>
                assignment.taskId === task.id &&
                assignment.date === today,
        )) {
            assignments.push({
                taskId: task.id,
                date: today,
                completed:
                    task.completed ||
                    task.completionHistory.includes(today),
            });
        }
    }

    await AsyncStorage.setItem(
        GLOBAL_TASKS_STORAGE_KEY,
        JSON.stringify(globalTasks),
    );

    await AsyncStorage.setItem(
        DAILY_TASKS_STORAGE_KEY,
        JSON.stringify({
            tasks: [],
            assignments,
        }),
    );
}

export async function loadTaskStorage(): Promise<TaskStorageData> {
    await migrateTaskStorage();

    const [globalRaw, dailyRaw] = await Promise.all([
        AsyncStorage.getItem(GLOBAL_TASKS_STORAGE_KEY),
        AsyncStorage.getItem(DAILY_TASKS_STORAGE_KEY),
    ]);

    if (globalRaw === null || dailyRaw === null) {
        throw new Error('Task storage has not been initialized.');
    }

    const globalItems = parseArray(globalRaw, GLOBAL_TASKS_STORAGE_KEY);
    const dailyParsed: unknown = JSON.parse(dailyRaw);

    if (!isRecord(dailyParsed) || !Array.isArray(dailyParsed.tasks) ||
        !Array.isArray(dailyParsed.assignments)) {
        throw new Error('The saved daily task data is invalid.');
    }

    if (!globalItems.every(isGlobalTask)) {
        throw new Error('The saved global task library is invalid.');
    }

    if (!dailyParsed.tasks.every(isDailyTask)) {
        throw new Error('The saved daily tasks are invalid.');
    }

    if (!dailyParsed.assignments.every(isAssignment)) {
        throw new Error('The saved task assignments are invalid.');
    }

    return {
        globalTasks: globalItems,
        dailyTasks: dailyParsed.tasks,
        assignments: dailyParsed.assignments,
    };
}

export async function saveTaskStorage(
    data: TaskStorageData,
): Promise<void> {
    await AsyncStorage.setItem(
        GLOBAL_TASKS_STORAGE_KEY,
        JSON.stringify(data.globalTasks),
    );

    await AsyncStorage.setItem(
        DAILY_TASKS_STORAGE_KEY,
        JSON.stringify({
            tasks: data.dailyTasks,
            assignments: data.assignments,
        }),
    );
}

export async function loadTasks(): Promise<Task[]> {
    const raw = await AsyncStorage.getItem(LEGACY_TASKS_STORAGE_KEY);

    if (raw === null) {
        return [];
    }

    return parseArray(raw, LEGACY_TASKS_STORAGE_KEY).map(item => {
        if (!isLegacyTask(item)) {
            throw new Error('An existing task has invalid data.');
        }

        return {
            id: item.id,
            title: item.title,
            completed: item.completed,
            completionHistory: isStringArray(item.completionHistory)
                ? item.completionHistory
                : [],
        };
    });
}

export async function saveTasks(tasks: Task[]): Promise<void> {
    await AsyncStorage.setItem(
        LEGACY_TASKS_STORAGE_KEY,
        JSON.stringify(tasks),
    );
}


export function getLocalDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


export async function removeGlobalTaskPermanently(
    taskId: string,
): Promise<void> {
    const data = await loadTaskStorage();

    const task = data.globalTasks.find(item => item.id === taskId);

    if (!task) {
        return;
    }

    const [historyRaw, dailyRaw] = await Promise.all([
        AsyncStorage.getItem(REMOVED_TASK_HISTORY_KEY),
        AsyncStorage.getItem(DAILY_TASKS_STORAGE_KEY),
    ]);

    const removedHistory: RemovedTaskHistory[] = historyRaw === null
        ? []
        : parseArray(historyRaw, REMOVED_TASK_HISTORY_KEY).filter(
            (item): item is RemovedTaskHistory =>
                isRecord(item) &&
                typeof item.taskId === 'string' &&
                typeof item.title === 'string' &&
                isStringArray(item.completionHistory),
        );

    const dailyParsed: unknown = dailyRaw === null
        ? null
        : JSON.parse(dailyRaw);

    const assignments =
        isRecord(dailyParsed) && Array.isArray(dailyParsed.assignments)
            ? dailyParsed.assignments.filter(isAssignment)
            : [];

    // Preserve dates already recorded in completion history, plus any
    // completed assignments that may not yet be in that history.
    const completionHistory = [
        ...new Set([
            ...task.completionHistory,
            ...assignments
                .filter(item => item.taskId === taskId && item.completed)
                .map(item => item.date),
        ]),
    ];

    const existingIndex = removedHistory.findIndex(
        item => item.taskId === taskId,
    );

    const historyEntry: RemovedTaskHistory = {
        taskId,
        title: task.title,
        completionHistory,
    };

    if (existingIndex >= 0) {
        removedHistory[existingIndex] = historyEntry;
    } else {
        removedHistory.push(historyEntry);
    }

    // Save history before removing the task from the active library.
    await AsyncStorage.setItem(
        REMOVED_TASK_HISTORY_KEY,
        JSON.stringify(removedHistory),
    );

    await saveTaskStorage({
        ...data,
        globalTasks: data.globalTasks.filter(item => item.id !== taskId),
        assignments: data.assignments.filter(
            item => item.taskId !== taskId,
        ),
    });
}

export async function loadRemovedTaskHistory(): Promise<RemovedTaskHistory[]> {
    const raw = await AsyncStorage.getItem(REMOVED_TASK_HISTORY_KEY);

    if (raw === null) {
        return [];
    }

    return parseArray(raw, REMOVED_TASK_HISTORY_KEY).filter(
        (item): item is RemovedTaskHistory =>
            isRecord(item) &&
            typeof item.taskId === 'string' &&
            typeof item.title === 'string' &&
            isStringArray(item.completionHistory),
    );
}
