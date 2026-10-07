import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../styles/globals";

export default function TaskCard() {
    return (
        <View style={styles.card}>
            <Text style={styles.heading}>Today:</Text>

            <View style={styles.taskCont}>
                <Pressable style={styles.task}>
                    <View style={styles.checkbox} />

                    <Text style={styles.taskText}>
                        Water plants
                    </Text>
                </Pressable>
            </View>

            <View style={styles.buttonCont}>
                <Pressable
                    style={({ pressed }) => [
                        styles.newTask,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() => { }}
                >
                    <Text style={styles.newTaskText}>Reports</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.newTask,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() => { }}
                >
                    <Text style={styles.newTaskText}>New task</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '92%',
        maxWidth: 500,
        minHeight: 300,

        backgroundColor: colors.card,
        borderRadius: radius.xxl,
        padding: spacing.lg,

        elevation: 6, //android ig

        // for ios
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
        marginTop: spacing.lg,
        paddingVertical: spacing.sm,
    },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: radius.sm,
        borderWidth: 2,
        borderColor: colors.subtle,
        marginRight: spacing.md,
    },

    taskText: {
        fontSize: 16,
        color: colors.text,
    },

    newTask: {
        width: '50%',
        marginTop: spacing.lg,
        paddingVertical: spacing.md,

        backgroundColor: colors.primaryLight,
        borderRadius: radius.md,

        alignItems: 'center',
        justifyContent: 'center',
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

    buttonCont: {
        flexDirection: 'row',
        gap: 10,
        padding: spacing.sm,
    },

    taskCont: {
        flexDirection: 'column',
        flex: 1,
    }
});