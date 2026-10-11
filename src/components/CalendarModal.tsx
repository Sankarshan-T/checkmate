
import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { colors, spacing, radius } from '../styles/globals';

type CalendarModalProps = {
    visible: boolean;
    selectedDate: string;
    onClose: () => void;
    onSelectDate: (date: string) => void;
};


export default function CalendarModal({
    visible,
    selectedDate,
    onClose,
    onSelectDate,
}: CalendarModalProps) {
    const today = new Date();
    const todayKey = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
    ].join('-');

    const handleDayPress = (day: DateData) => {
        onSelectDate(day.dateString);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                    accessibilityLabel="Close calendar"
                />

                <View style={styles.modal}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Choose a date</Text>
                            <Text style={styles.subtitle}>
                                View your tasks for another day
                            </Text>
                        </View>

                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                            accessibilityRole="button"
                            accessibilityLabel="Close calendar"
                        >
                            <Text style={styles.closeText}>×</Text>
                        </Pressable>
                    </View>

                    <Calendar
                        current={selectedDate}
                        onDayPress={handleDayPress}
                        markedDates={{
                            [selectedDate]: {
                                selected: true,
                                selectedColor: colors.primary,
                            },
                            ...(todayKey !== selectedDate
                                ? {
                                    [todayKey]: {
                                        marked: true,
                                        dotColor: colors.primary,
                                    },
                                }
                                : {}),
                        }}
                        theme={{
                            calendarBackground: colors.card,
                            backgroundColor: colors.card,
                            textSectionTitleColor: colors.muted,
                            selectedDayBackgroundColor: colors.primary,
                            selectedDayTextColor: '#FFFFFF',
                            todayTextColor: colors.primary,
                            dayTextColor: colors.text,
                            textDisabledColor: colors.subtle,
                            monthTextColor: colors.text,
                            arrowColor: colors.primary,
                            textMonthFontWeight: '700',
                            textDayFontSize: 15,
                            textMonthFontSize: 17,
                            textDayHeaderFontWeight: '600',
                        }}
                        enableSwipeMonths
                    />

                    <Pressable
                        style={styles.todayButton}
                        onPress={() => handleDayPress({
                            dateString: todayKey,
                            day: today.getDate(),
                            month: today.getMonth() + 1,
                            year: today.getFullYear(),
                            timestamp: today.getTime(),
                        })}
                    >
                        <Text style={styles.todayButtonText}>Back to today</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    modal: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: colors.card,
        borderRadius: radius.xl,
        padding: spacing.md,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    subtitle: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: radius.round,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    closeText: {
        fontSize: 26,
        color: colors.text,
        lineHeight: 30,
    },
    todayButton: {
        marginTop: spacing.sm,
        backgroundColor: colors.primaryLight,
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    todayButtonText: {
        color: colors.primary,
        fontWeight: '700',
    },
});