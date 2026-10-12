import { useState } from 'react';

import {
    colors,
    radius,
    spacing,
} from '../styles/globals';

import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';

import {
    Trash2,
    Plus,
    Check,
    CalendarDays,
    ChevronDown,
    Library,
} from 'lucide-react-native';

import type { GlobalTask, Task } from '../storage/taskStorage';
import TaskLibraryModal from './TaskLibraryModal';

type TaskCardProps = {
    tasks: Task[];
    onRequestAddTask: () => void;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    selectedDate: string;
    onOpenCalendar: () => void;
    globalTasks: GlobalTask[];
    assignedTaskIds: string[];
    onAddGlobalTask: (title: string) => void;
    onAssignGlobalTask: (taskId: string) => void;
    onRemoveGlobalTask: (taskId: string) => void;
};

export default function TaskCard({
    tasks,
    onRequestAddTask,
    onToggleTask,
    onDeleteTask,
    selectedDate,
    onOpenCalendar,
    globalTasks,
    assignedTaskIds,
    onAddGlobalTask,
    onAssignGlobalTask,
    onRemoveGlobalTask,
}: TaskCardProps) {
    const [libraryVisible, setLibraryVisible] = useState(false);
    const { height: screenHeight } = useWindowDimensions();

    return (
        <View style={[styles.card, { maxHeight: screenHeight * 0.5 }]}>
            <Pressable
                style={styles.dateHeading}
                onPress={onOpenCalendar}
                accessibilityRole="button"
                accessibilityLabel="Choose a date"
            >
                <CalendarDays size={22} color={colors.primary} />

                <Text style={styles.heading}>
                    {selectedDate === [
                        new Date().getFullYear(),
                        String(new Date().getMonth() + 1).padStart(2, '0'),
                        String(new Date().getDate()).padStart(2, '0'),
                    ].join('-')
                        ? 'Today'
                        : new Date(
                            Number(selectedDate.slice(0, 4)),
                            Number(selectedDate.slice(5, 7)) - 1,
                            Number(selectedDate.slice(8, 10)),
                        ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                </Text>

                <ChevronDown size={20} color={colors.muted} />
            </Pressable>

            <ScrollView
                style={styles.taskCont}
                contentContainerStyle={styles.taskContent}
                showsVerticalScrollIndicator
            >
                {tasks.length === 0 ? (
                    <Text style={styles.placeholder}>
                        No tasks yet :D Add one now!!
                    </Text>
                ) : (
                    tasks.map(task => (
                        <View style={styles.task} key={task.id}>
                            <Pressable
                                style={styles.taskMain}
                                onPress={() => onToggleTask(task.id)}
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: task.completed }}
                                accessibilityLabel={task.title}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        task.completed && styles.checkboxCompleted,
                                    ]}
                                >
                                    {task.completed && (
                                        <Check
                                            size={20}
                                            color={colors.primaryLight}
                                            strokeWidth={3}
                                        />
                                    )}
                                </View>

                                <Text
                                    style={[
                                        styles.taskText,
                                        task.completed && styles.taskTextCompleted,
                                    ]}
                                >
                                    {task.title}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.deleteButton}
                                onPress={() => {
                                    Alert.alert(
                                        'Delete task?',
                                        `Are you sure you want to delete "${task.title}"?`,
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Delete',
                                                style: 'destructive',
                                                onPress: () => onDeleteTask(task.id),
                                            },
                                        ],
                                    );
                                }}
                                accessibilityRole="button"
                                accessibilityLabel={`Delete ${task.title}`}
                            >
                                <Trash2
                                    size={20}
                                    color="#C62828"
                                    strokeWidth={1.8}
                                />
                            </Pressable>
                        </View>

                    ))
                )}
            </ScrollView>

            <View style={styles.buttonCont}>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionButton,
                        styles.menuButton,
                        pressed && styles.menuButtonPressed,
                    ]}
                    onPress={() => setLibraryVisible(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Open task library"
                >
                    <Library size={20} color={colors.card} strokeWidth={2} />
                    <Text style={styles.menuText}>Global Tasks</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.actionButton,
                        styles.newTask,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={onRequestAddTask}
                    accessibilityRole="button"
                >
                    <Plus
                        size={20}
                        color={colors.primary}
                        strokeWidth={3} />
                    <Text style={styles.newTaskText}>
                        New task
                    </Text>
                </Pressable>
            </View>

            <TaskLibraryModal
                visible={libraryVisible}
                tasks={globalTasks}
                selectedDate={selectedDate}
                assignedTaskIds={assignedTaskIds}
                onClose={() => setLibraryVisible(false)}
                onAddTask={onAddGlobalTask}
                onAssignTask={onAssignGlobalTask}
                onRemoveTask={onRemoveGlobalTask}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        width: '92%',
        maxWidth: 500,
        minHeight: 0,
        backgroundColor: colors.card,
        borderRadius: radius.xl,
        padding: spacing.lg,
        elevation: 6,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },

    heading: {
        fontSize: 23,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: colors.muted,
    },

    placeholder: {
        marginTop: spacing.md,
        fontSize: 16,
        color: colors.muted,
    },

    task: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        paddingVertical: spacing.sm,
    },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: radius.sm,
        borderWidth: 2,
        borderColor: colors.subtle,
        marginRight: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkboxCompleted: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    taskText: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },

    taskTextCompleted: {
        textDecorationLine: 'line-through',
        color: colors.subtle,
    },

    buttonCont: {
        flexDirection: 'row',
        alignItems: 'stretch',
        width: '100%',
        gap: spacing.sm,
        marginTop: spacing.md,
    },

    taskMain: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },

    deleteButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
        marginLeft: spacing.xs,
    },

    newTask: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.primary,
    },

    actionButton: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0,
        minHeight: 48,
        flexDirection: 'row',
        gap: spacing.xs,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.md,
    },

    newTaskText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.primary,
    },

    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.97 }],
    },

    taskCont: {
        flex: 1,
        flexShrink: 1,
        minHeight: 0,
    },

    taskContent: {
        padding: spacing.md,
    },
    dateHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: spacing.sm,
        paddingVertical: spacing.xs,
    },

    menuButton: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.primary,
    },

    menuButtonPressed: {
        backgroundColor: '#256829',
        transform: [{ scale: 0.97 }],
    },

    menuText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.card,
    },
});
