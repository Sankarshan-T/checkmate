import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../styles/globals";

export default function TaskCard() {
    return (
        <View style={styles.card}>
            <Text style={styles.heading}>Today:</Text>

            <Text style={styles.placeholder}>
                Your tasks will appear here :)
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        padding: spacing.lg,

        elevation: 4,

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
});