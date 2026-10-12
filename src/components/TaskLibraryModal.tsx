
import React from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    CalendarDays,
    Check,
    Plus,
    Library,
    Trash2,
} from 'lucide-react-native';

import {
    colors,
    radius,
    spacing,
} from '../styles/globals';

import type { GlobalTask } from '../storage/taskStorage';

type TaskLibraryModalProps = {
    visible: boolean;
    tasks: GlobalTask[];
    selectedDate: string;
    assignedTaskIds: string[];
    onClose: () => void;
    onAddTask: (title: string) => void;
    onRemoveTask: (taskId: string) => void;
    onAssignTask: (taskId: string) => void;
};

export default function TaskLibraryModal({
    visible,
    tasks,
    selectedDate,
    assignedTaskIds,
    onClose,
    onAddTask,
    onAssignTask,
    onRemoveTask,
}: TaskLibraryModalProps) {
    const [title, setTitle] = React.useState('');

    const handleAdd = () => {
        const trimmed = title.trim();

        if (!trimmed) {
            Alert.alert('Missing task name', 'Enter a task name first.');
            return;
        }

        onAddTask(trimmed);
        setTitle('');
    };


    const handleRemove = (task: GlobalTask) => {
        Alert.alert(
            'Remove reusable task?',
            `"${task.title}" will be removed from your library and its future assignments :( Past completion history will still be preserved.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => onRemoveTask(task.id),
                },
            ],
        );
    };

    const formattedDate = new Date(
        Number(selectedDate.slice(0, 4)),
        Number(selectedDate.slice(5, 7)) - 1,
        Number(selectedDate.slice(8, 10)),
    ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.headingRow}>
                        <Library size={25} color={colors.primary} />
                        <Text style={styles.heading}>Task library</Text>
                    </View>

                    <Text style={styles.description}>
                        Save reusable tasks here and add them to a day whenever you need them.
                    </Text>

                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Water plants"
                            placeholderTextColor={colors.subtle}
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                            returnKeyType="done"
                            onSubmitEditing={handleAdd}
                        />

                        <Pressable
                            style={styles.addButton}
                            onPress={handleAdd}
                            accessibilityRole="button"
                            accessibilityLabel="Add to task library"
                        >
                            <Plus size={22} color={colors.card} />
                        </Pressable>
                    </View>


                    <View style={styles.destinationBanner}>
                        <CalendarDays size={20} color={colors.primary} />
                        <View style={styles.destinationCopy}>
                            <Text style={styles.destinationLabel}>Adding tasks to</Text>
                            <Text style={styles.destinationDate}>{formattedDate}</Text>
                        </View>
                    </View>

                    <View style={styles.sectionHeading}>
                        <Text style={styles.sectionTitle}>Reusable tasks</Text>
                        <Text style={styles.taskCount}>{tasks.length}</Text>
                    </View>

                    <ScrollView
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {tasks.length === 0 ? (
                            <Text style={styles.emptyText}>
                                Your task library is empty. Add your reusable tasks above!!!!!
                            </Text>
                        ) : (
                            tasks.map(task => {
                                const isAssigned = assignedTaskIds.includes(task.id);

                                return (
                                    <View style={styles.taskRow} key={task.id}>
                                        <View style={styles.taskInfo}>
                                            <Text style={styles.taskTitle}>{task.title}</Text>
                                        </View>

                                        <Pressable
                                            style={[
                                                styles.iconButton,
                                                styles.assignIconButton,
                                                isAssigned && styles.assignedIconButton,
                                            ]}
                                            onPress={() => onAssignTask(task.id)}
                                            disabled={isAssigned}
                                            accessibilityRole="button"
                                            accessibilityLabel={
                                                isAssigned
                                                    ? `${task.title} already added to this day`
                                                    : `Add ${task.title} to this day`
                                            }
                                        >
                                            {isAssigned ? (
                                                <Check size={19} color={colors.primary} />
                                            ) : (
                                                <Plus size={20} color={colors.primary} />
                                            )}
                                        </Pressable>

                                        <Pressable
                                            style={[styles.iconButton, styles.removeIconButton]}
                                            onPress={() => handleRemove(task)}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Remove ${task.title} permanently from library`}
                                        >
                                            <Trash2 size={18} color="#C62828" />
                                        </Pressable>
                                    </View>
                                );
                            })
                        )}
                    </ScrollView>

                    <Pressable
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeText}>Done</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    card: {
        width: '100%',
        maxWidth: 480,
        maxHeight: '85%',
        backgroundColor: colors.card,
        borderRadius: radius.xl,
        padding: spacing.lg,
        elevation: 8,
    },
    headingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
    },
    description: {
        fontSize: 14,
        color: colors.muted,
        lineHeight: 21,
        marginTop: spacing.sm,
        marginBottom: spacing.md,
    },
    inputRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        minWidth: 0,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        color: colors.text,
        fontSize: 16,
    },

    addButton: {
        width: 48,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },

    destinationBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.primaryLight,
        borderRadius: radius.md,
    },
    destinationCopy: {
        flex: 1,
    },

    destinationLabel: {
        fontSize: 12,
        color: colors.muted,
    },
    destinationDate: {
        marginTop: 2,
        fontSize: 15,
        fontWeight: '700',
        color: colors.primary,
    },
    sectionHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.lg,
        marginBottom: spacing.xs,
    },
    taskCount: {
        minWidth: 24,
        textAlign: 'center',
        color: colors.muted,
        fontSize: 13,
        fontWeight: '600',
        backgroundColor: colors.background,
        borderRadius: radius.round,
        overflow: 'hidden',
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
    },
    list: {
        flexGrow: 0,
        flexShrink: 1,
    },
    listContent: {
        paddingBottom: spacing.xs,
    },
    emptyText: {
        color: colors.muted,
        lineHeight: 22,
        paddingVertical: spacing.lg,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    taskInfo: {
        flex: 1,
        minWidth: 0,
    },

    taskTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.text,
    },

    iconButton: {
        width: 38,
        height: 38,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },

    assignIconButton: {
        backgroundColor: colors.primaryLight,
    },

    assignedIconButton: {
        backgroundColor: '#EEF5EE',
    },

    removeIconButton: {
        backgroundColor: '#FCEEEE',
    },

    closeButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderRadius: radius.md,
        marginTop: spacing.md,
    },
    closeText: {
        color: colors.card,
        fontSize: 16,
        fontWeight: '700',
    },
});