import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    colors,
    radius,
    spacing,
} from '../styles/globals';


type AddTaskModalProps = {
    visible: boolean;
    onClose: () => void;
    onAddTask: (title: string) => void;
};

export default function AddTaskModal({
    visible,
    onClose,
    onAddTask,
}: AddTaskModalProps) {
    const [title, setTitle] = React.useState('');

    const handleAdd = () => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            return;
        }

        onAddTask(trimmedTitle);
        setTitle('');
    };

    const handleClose = () => {
        setTitle('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.heading}>New task :D</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Clean windows"
                        placeholderTextColor={colors.subtle}
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleAdd}
                    />

                    <Pressable
                        style={({ pressed }) => [
                            styles.addButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleAdd}
                    >
                        <Text style={styles.addButtonText}>Add task</Text>
                    </Pressable>

                    <Pressable
                        style={styles.cancelButton}
                        onPress={handleClose}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },

    card: {
        width: '100%',
        maxWidth: 420,
        padding: spacing.lg,
        backgroundColor: colors.card,
        borderRadius: radius.xl,
        elevation: 8,
    },

    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.lg,
    },

    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.md,
    },

    addButton: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        padding: spacing.md,
        alignItems: 'center',
    },

    addButtonText: {
        color: colors.card,
        fontSize: 16,
        fontWeight: '700',
    },

    cancelButton: {
        padding: spacing.md,
        alignItems: 'center',
    },

    cancelText: {
        color: colors.muted,
        fontSize: 15,
        fontWeight: '600',
    },

    pressed: {
        opacity: 0.75,
        transform: [{ scale: 0.97 }],
    },
});