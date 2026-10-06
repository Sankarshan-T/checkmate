import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../styles/globals";

export default function TaskCard() {
    return (
        <View style={styles.card}>
            <Text style={styles.heading}>Today:</Text>

            <Pressable style={styles.task}>
                <View style={styles.checkbox} />

                <Text style={styles.taskText}>
                    Water plants
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '75%',
        aspectRatio: 1,

        backgroundColor: colors.card,
        borderRadius: radius.xl,
        padding: spacing.lg,

        elevation: 4, //android ig

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
        fontSize: 13,
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
});