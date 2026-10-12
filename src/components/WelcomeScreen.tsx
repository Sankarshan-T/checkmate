import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors, radius, spacing } from "../styles/globals";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    ChartNoAxesColumn,
    CheckCircle2,
    ListChecks,
    Sparkles,
} from "lucide-react-native";

type WelcomeScreenProps = {
    onComplete: () => void;
}

const pages = [
    {
        icon: ListChecks,
        eyebrow: 'hello!!!',
        title: 'Welcome to Checkmate',
        description:
            'Keep your regular tasks in one place.',
        features: ['Add tasks for each day', 'Get monthy reports on progress'],
    },
    {
        icon: CalendarDays,
        eyebrow: 'plan your month',
        title: 'choose what to do',
        description:
            'Add tasks for multiple days.',
        features: ['Plan one day at a time', 'Reuse saved tasks'],
    },
    {
        icon: ChartNoAxesColumn,
        eyebrow: 'progress',
        title: 'save your progress',
        description:
            'Complete tasks as you go.',
        features: ['Track completed tasks', 'View your progress in Reports'],
    },
];

export default function WelcomeScreen({
    onComplete,
}: WelcomeScreenProps) {
    const [pageIndex, setPageIndex] = useState(0);
    const { width, height } = useWindowDimensions();

    const isCompact = width < 380 || height < 650;
    const isLastPage = pageIndex === pages.length - 1;
    const page = pages[pageIndex];
    const PageIcon = page.icon;

    const goNext = () => {
        if (isLastPage) {
            onComplete();
            return;
        }

        setPageIndex(current => current + 1);
    };

    const goBack = () => {
        setPageIndex(current => Math.max(0, current - 1));
    };

    return (
        <View style={styles.container}>
            <View style={styles.decorativeCircleOne} />
            <View style={styles.decorativeCircleTwo} />

            <View style={[styles.topBar, isCompact && styles.topBarCompact]}>
                <Text style={styles.logo}>checkmate</Text>

                <Pressable
                    onPress={onComplete}
                    accessibilityRole="button"
                    accessibilityLabel="Skip onboarding"
                    hitSlop={10}
                    style={({ pressed }) => [
                        styles.skipButton,
                        pressed && styles.pressed
                    ]}
                >
                    <Text style={styles.skipText}> Skip </Text>
                </Pressable>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    isCompact && styles.scrollContentCompact,
                ]}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View
                    style={[
                        styles.illustrationArea,
                        isCompact && styles.illustrationAreaCompact,
                    ]}
                >
                    <View
                        style={[
                            styles.illustrationCircle,
                            isCompact && styles.illustrationCircleCompact,
                        ]}
                    >
                        <PageIcon
                            size={isCompact ? 54 : 76}
                            color={colors.primary}
                            strokeWidth={1.7}
                        />
                    </View>

                    <View style={styles.sparkleOne}>
                        <Sparkles size={24} color={colors.primary} />
                    </View>

                    <View style={styles.sparkleTwo}>
                        <CheckCircle2 size={28} color={colors.primary} />
                    </View>
                </View>

                <View style={styles.textContent}>
                    <Text style={styles.eyebrow}>{page.eyebrow}</Text>

                    <Text
                        style={[
                            styles.title,
                            isCompact && styles.titleCompact,
                        ]}
                    >
                        {page.title}
                    </Text>

                    <Text style={styles.description}>
                        {page.description}
                    </Text>

                    <View style={[styles.features, isCompact && styles.featuresCompact]}>
                        {page.features.map(feature => (
                            <View
                                key={feature}
                                style={[
                                    styles.featureRow,
                                    isCompact && styles.featureRowCompact,
                                ]}
                            >
                                <CheckCircle2
                                    size={19}
                                    color={colors.primary}
                                    strokeWidth={2}
                                />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.bottomArea, isCompact && styles.bottomAreaCompact]}>
                <View
                    style={[styles.pagination, isCompact && styles.paginationCompact]}
                    accessibilityLabel={`Page ${pageIndex + 1} of ${pages.length}`}
                >
                    {pages.map((item, index) => (
                        <View
                            key={item.title}
                            style={[
                                styles.dot,
                                index === pageIndex && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <View style={[styles.navigation, isCompact && styles.navigationCompact]}>
                    {pageIndex > 0 ? (
                        <Pressable
                            style={({ pressed }) => [
                                styles.backButton,
                                isCompact && styles.backButtonCompact,
                                pressed && styles.pressed,
                            ]}
                            onPress={goBack}
                            accessibilityRole="button"
                            accessibilityLabel="Previous page"
                        >
                            <ArrowLeft size={21} color={colors.primary} />
                        </Pressable>
                    ) : (
                        <View
                            style={[
                                styles.backPlaceholder,
                                isCompact && styles.backPlaceholderCompact,
                            ]}
                        />
                    )}

                    <Pressable
                        style={({ pressed }) => [
                            styles.nextButton,
                            isCompact && styles.navigationButtonCompact,
                            pressed && styles.nextButtonPressed,
                        ]}
                        onPress={goNext}
                        accessibilityRole="button"
                        accessibilityLabel={
                            isLastPage ? 'Get started' : 'Next page'
                        }
                    >
                        <Text style={styles.nextButtonText}>
                            {isLastPage ? "Let's go!" : 'Next'}
                        </Text>

                        <ArrowRight size={20} color="#FFFFFF" />
                    </Pressable>

                    <View
                        style={[
                            styles.backPlaceholder,
                            isCompact && styles.backPlaceholderCompact,
                        ]}
                    />
                </View>

                <Text style={styles.footerText}>
                    Small steps add up 💚
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        overflow: 'hidden',
    },

    decorativeCircleOne: {
        position: 'absolute',
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: colors.primaryLight,
        right: -120,
        top: 110,
        opacity: 0.7,
    },

    decorativeCircleTwo: {
        position: 'absolute',
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: colors.primarySoft,
        left: -100,
        bottom: 120,
        opacity: 0.8,
    },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
    },

    topBarCompact: {
        paddingVertical: spacing.xs,
    },

    logo: {
        fontSize: 25,
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: -0.8,
    },

    skipButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.round,
    },

    skipText: {
        color: colors.muted,
        fontSize: 14,
        fontWeight: '600',
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: spacing.lg,
    },

    scrollContentCompact: {
        justifyContent: 'flex-start',
        paddingTop: spacing.xs,
        paddingBottom: spacing.sm,
    },

    illustrationArea: {
        height: 205,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: spacing.lg,
    },

    illustrationAreaCompact: {
        height: 132,
        marginBottom: spacing.md,
    },

    illustrationCircle: {
        width: 175,
        height: 175,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D3E7D3',
        backgroundColor: colors.card,
        padding: spacing.sm,
        borderRadius: radius.round,
        elevation: 3,
        shadowColor: colors.primary,
    },

    illustrationCircleCompact: {
        width: 118,
        height: 118,
        borderRadius: 59,
    },

    sparkleOne: {
        position: 'absolute',
        top: 20,
        right: '19%',
        backgroundColor: colors.card,
        padding: spacing.sm,
        borderRadius: radius.round,
        elevation: 3,
        shadowColor: colors.primary,
    },

    sparkleTwo: {
        position: 'absolute',
        bottom: 15,
        left: '17%',
        backgroundColor: colors.card,
        padding: spacing.sm,
        borderRadius: radius.round,
        elevation: 3,
        shadowColor: colors.primary,
    },

    textContent: {
        width: '100%',
        maxWidth: 520,
        alignSelf: 'center',
    },

    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        color: colors.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },

    title: {
        fontSize: 32,
        lineHeight: 39,
        fontWeight: '800',
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.md,
    },

    titleCompact: {
        fontSize: 27,
        lineHeight: 33,
        marginBottom: spacing.sm,
    },

    description: {
        fontSize: 16,
        lineHeight: 25,
        color: colors.muted,
        textAlign: 'center',
        paddingHorizontal: spacing.sm,
    },

    features: {
        marginTop: spacing.lg,
        gap: spacing.md,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 350,
    },

    featuresCompact: {
        marginTop: spacing.md,
        gap: spacing.sm,
    },

    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },

    featureRowCompact: {
        minHeight: 24,
    },

    featureText: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
    },

    bottomArea: {
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
    },

    bottomAreaCompact: {
        paddingTop: spacing.xs,
        paddingBottom: spacing.sm,
    },

    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },

    paginationCompact: {
        marginBottom: spacing.sm,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CCD8CC',
    },

    activeDot: {
        width: 25,
        backgroundColor: colors.primary,
    },

    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },

    navigationCompact: {
        gap: spacing.sm,
    },

    backButton: {
        width: 54,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: '#D3E7D3',
        backgroundColor: colors.card,
    },

    backButtonCompact: {
        width: 46,
        height: 46,
    },

    backPlaceholder: {
        width: 54,
    },

    backPlaceholderCompact: {
        width: 46,
    },

    nextButton: {
        flex: 1,
        minHeight: 54,
        borderRadius: radius.lg,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
    },

    navigationButtonCompact: {
        minHeight: 46,
    },

    nextButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    pressed: {
        opacity: 0.7,
    },

    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    footerText: {
        marginTop: spacing.md,
        textAlign: 'center',
        fontSize: 12,
        color: colors.subtle,
    },
});