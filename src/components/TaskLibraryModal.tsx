
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

import { Check, Plus, Library, Trash2 } from 'lucide-react-native';

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
                        Save globals tasks here, then add them to whichever days you choose :)
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


                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: spacing.md,
                        padding: spacing.sm,
                    }}>
                        <Text style={styles.sectionTitle}>
                            Reusable tasks: ({tasks.length})
                        </Text>
                        <Text style={styles.dateNote}>
                            Adding tasks to: {formattedDate}
                        </Text>
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
                                const isAssigned =
                                    assignedTaskIds.includes(task.id);

                                return (
                                    <View style={styles.taskRow}>
                                        <View style={styles.taskInfo}>
                                            <Text style={styles.taskTitle}>{task.title}</Text>
                                        </View>

                                        <Pressable
                                            style={[
                                                styles.iconButton,
                                                styles.assignIconButton,
                                                assignedTaskIds.includes(task.id) && styles.assignedIconButton,
                                            ]}
                                            onPress={() => onAssignTask(task.id)}
                                            disabled={assignedTaskIds.includes(task.id)}
                                            accessibilityRole="button"
                                            accessibilityLabel={
                                                assignedTaskIds.includes(task.id)
                                                    ? `${task.title} already added to this day`
                                                    : `Add ${task.title} to this day`
                                            }
                                        >
                                            {assignedTaskIds.includes(task.id) ? (
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

    assignButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.md,
        backgroundColor: colors.primaryLight,
    },

    removeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.md,
        backgroundColor: '#FCEEEE',
    },

    removeText: {
        color: '#C62828',
        fontSize: 13,
        fontWeight: '600',
    },

    removeHint: {
        color: colors.muted,
        fontSize: 11,
    },
    assignedButton: {
        backgroundColor: '#F0F5F0',
    },
    assignText: {
        color: colors.primary,
        fontWeight: '700',
    },
    assignedText: {
        color: colors.primary,
        fontWeight: '600',
    },
    dateNote: {
        fontSize: 13,
        color: colors.muted,
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