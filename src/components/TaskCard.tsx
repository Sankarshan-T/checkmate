import {
    colors,
    radius,
    spacing,
} from '../styles/globals';

import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    Trash2,
    Plus,
    ChartNoAxesColumn,
    Check,
} from 'lucide-react-native';

import type { Task } from '../storage/taskStorage';

type TaskCardProps = {
    tasks: Task[];
    onRequestAddTask: () => void;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
};

export default function TaskCard({
    tasks,
    onRequestAddTask,
    onToggleTask,
    onDeleteTask,
}: TaskCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.heading}>Today:</Text>

            <View style={styles.taskCont}>
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
            </View>

            <View style={styles.buttonCont}>
                <Pressable
                    style={({ pressed }) => [
                        styles.newTask,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() => {
                        // todo: reports stuff
                    }}
                    accessibilityRole="button"
                >
                    <ChartNoAxesColumn
                        size={20}
                        color={colors.primary}
                        strokeWidth={3}
                    />
                    <Text style={styles.newTaskText}>
                        Reports
                    </Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
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
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '92%',
        maxWidth: 500,
        minHeight: 300,
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

    checkmark: {
        color: colors.card,
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 19,
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
        gap: spacing.sm,
        padding: spacing.sm,
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

    deleteText: {
        fontSize: 27,
        color: '#C62828',
        fontWeight: '400',
    },

    newTask: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        marginTop: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.primaryLight,
        borderRadius: radius.md,
        alignItems: 'center',
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
        flexDirection: 'column',
        flex: 1,
        padding: spacing.md
    },
});
