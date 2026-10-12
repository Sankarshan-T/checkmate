import {
    ArrowLeft,
    CalendarDays,
    ChevronsLeft,
    ChevronsRight,
    PartyPopper,
} from 'lucide-react-native';
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing } from "../styles/globals";

import React, { useState } from 'react';

import type { TaskStorageData } from '../storage/taskStorage';

type Props = {
    onBack: () => void;
    storageData: TaskStorageData;
};

export default function ReportsScreen({
    onBack,
    storageData,
}: Props) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const goToPreviousMonth = () => {
        setCurrentMonth(
            (month) =>
                new Date(
                    month.getFullYear(),
                    month.getMonth() - 1,
                    1,
                ),
        );
    };

    const goToNextMonth = () => {
        setCurrentMonth(
            (month) =>
                new Date(
                    month.getFullYear(),
                    month.getMonth() + 1,
                    1,
                ),
        );
    };

    const monthLabel = currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    const monthKey = `${currentMonth.getFullYear()}-${String(
        currentMonth.getMonth() + 1,
    ).padStart(2, '0')}`;


    const monthStart = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
    );

    const nextMonthStart = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1,
    );

    const isInSelectedMonth = (date: string) => {
        const parsedDate = new Date(`${date}T00:00:00`);
        return (
            parsedDate >= monthStart &&
            parsedDate < nextMonthStart
        );
    };

    const globalCompletions = storageData.globalTasks.reduce(
        (total, task) =>
            total +
            task.completionHistory.filter(isInSelectedMonth).length,
        0,
    );

    const dailyCompletions = storageData.dailyTasks.filter(
        task => task.completed && isInSelectedMonth(task.date),
    ).length;

    const assignmentCompletions = storageData.assignments.filter(
        assignment =>
            assignment.completed && isInSelectedMonth(assignment.date),
    ).length;

    const totalCompletions =
        globalCompletions +
        dailyCompletions;

    const completedDates = new Set<string>();

    storageData.globalTasks.forEach(task => {
        task.completionHistory.forEach(date => {
            if (isInSelectedMonth(date)) {
                completedDates.add(date);
            }
        });
    });

    storageData.dailyTasks.forEach(task => {
        if (task.completed && isInSelectedMonth(task.date)) {
            completedDates.add(task.date);
        }
    });

    storageData.assignments.forEach(assignment => {
        if (
            assignment.completed &&
            isInSelectedMonth(assignment.date)
        ) {
            completedDates.add(assignment.date);
        }
    });

    const activeDays = completedDates.size;


    const taskBreakdown = [
        ...storageData.globalTasks.map(task => ({
            id: task.id,
            title: task.title,
            count: task.completionHistory.filter(
                isInSelectedMonth,
            ).length,
        })),
        ...storageData.dailyTasks.reduce<
            { id: string; title: string; count: number }[]
        >((result, task) => {
            if (task.completed && isInSelectedMonth(task.date)) {
                const existing = result.find(
                    item => item.title === task.title,
                );

                if (existing) {
                    existing.count += 1;
                } else {
                    result.push({
                        id: task.id,
                        title: task.title,
                        count: 1,
                    });
                }
            }

            return result;
        }, []),
    ].filter(task => task.count > 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={onBack}
                    accessibilityRole="button"
                >
                    <ArrowLeft size={22} color={colors.primary} />
                </Pressable>

                <View>
                    <Text style={styles.title}>Your reports</Text>
                    <Text style={styles.subtitle}>
                        Look at your monthly progress!!
                    </Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.monthSelector}>
                    <Pressable
                        style={styles.monthButton}
                        onPress={goToPreviousMonth}
                        accessibilityRole="button"
                        accessibilityLabel="Previous month"
                    >
                        <ChevronsLeft size={24} color={colors.primary} />
                    </Pressable>

                    <View style={styles.monthTextContainer}>
                        <Text style={styles.monthLabel}>{monthLabel}</Text>
                        <Text style={styles.monthSubtitle}>
                            Your monthly progress
                        </Text>
                    </View>

                    <Pressable
                        style={styles.monthButton}
                        onPress={goToNextMonth}
                        accessibilityRole="button"
                        accessibilityLabel="Next month"
                    >
                        <ChevronsRight size={24} color={colors.primary} />
                    </Pressable>

                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <PartyPopper
                            size={27}
                            color={colors.primary}
                            strokeWidth={2.2}
                            style={styles.summaryIconGraphic}
                        />
                    </View>

                    <Text style={styles.summaryNumber}>
                        {totalCompletions}
                    </Text>

                    <Text style={styles.summaryTitle}>
                        Tasks completed
                    </Text>

                    <Text style={styles.summarySubtitle}>
                        You're on fire mate!!!!
                    </Text>
                </View>


                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <CalendarDays
                            size={27}
                            color={colors.primary}
                            strokeWidth={2.2}
                            style={styles.summaryIconGraphic}
                        />
                    </View>

                    <Text style={styles.summaryNumber}>
                        {activeDays}
                    </Text>

                    <Text style={styles.summaryTitle}>
                        Active days
                    </Text>

                    <Text style={styles.summarySubtitle}>
                        Days you made progress during the month!!!!!
                    </Text>
                </View>

                <View style={styles.breakdownSection}>
                    <Text style={styles.breakdownHeading}>
                        Task breakdown:
                    </Text>

                    {taskBreakdown.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Text style={styles.emptyTitle}>
                                Your progress starts here :D
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                Complete some tasks this month to see your progress!
                            </Text>
                        </View>
                    ) : (
                        taskBreakdown.map(task => (
                            <View key={task.id} style={styles.taskRow}>
                                <View style={styles.taskInfo}>
                                    <Text style={styles.taskTitle}>
                                        {task.title}
                                    </Text>
                                    <Text style={styles.taskCount}>
                                        {task.count}{' '}
                                        {task.count === 1 ? 'completion' : 'completions'}
                                    </Text>
                                </View>

                                <View style={styles.taskCountBadge}>
                                    <Text style={styles.taskCountNumber}>
                                        {task.count}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginTop: spacing.md,
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: radius.md,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 25,
        fontWeight: '800',
        color: colors.text,
    },

    subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: colors.muted,
    },


    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    placeholder: {
        fontSize: 16,
        color: colors.muted,
        textAlign: 'center',
    },

    monthSelector: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.card,
        padding: spacing.sm,
        borderRadius: radius.lg,
        marginBottom: spacing.lg,
    },

    monthButton: {
        width: 44,
        height: 44,
        borderRadius: radius.md,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    monthTextContainer: {
        flex: 1,
        alignItems: 'center',
    },

    monthLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
    },

    monthSubtitle: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
    },


    summaryCard: {
        width: '100%',
        maxWidth: 420,
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginTop: spacing.md,
        elevation: 3,
    },

    summaryIcon: {
        width: 56,
        height: 56,
        borderRadius: radius.round,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },

    summaryIconGraphic: {
        width: 27,
        height: 27,
    },

    summaryNumber: {
        fontSize: 44,
        fontWeight: '800',
        color: colors.primary,
    },

    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginTop: spacing.xs,
    },

    summarySubtitle: {
        fontSize: 13,
        color: colors.muted,
        marginTop: spacing.sm,
        textAlign: 'center',
    },

    breakdownSection: {
        width: '100%',
        maxWidth: 420,
        marginTop: spacing.xl,
    },

    breakdownHeading: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text,
        marginBottom: spacing.md,
    },

    emptyCard: {
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: radius.xl,
        padding: spacing.xl,
    },


    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },

    emptySubtitle: {
        fontSize: 13,
        color: colors.muted,
        textAlign: 'center',
        marginTop: spacing.sm,
    },

    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        elevation: 1,
    },

    taskInfo: {
        flex: 1,
        marginRight: spacing.md,
    },

    taskTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text,
    },

    taskCount: {
        fontSize: 12,
        color: colors.muted,
        marginTop: spacing.xs,
    },

    taskCountBadge: {
        minWidth: 42,
        height: 42,
        borderRadius: radius.md,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.sm,
    },

    taskCountNumber: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.primary,
    },

})