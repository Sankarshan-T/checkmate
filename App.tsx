import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  colors,
  spacing,
  radius,
} from './src/styles/globals';

import TaskCard from './src/components/TaskCard';
import React from 'react';


export default function App() {
  const now = new Date();
  const hour = now.getHours();

  let greeting = '';

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  } as const;

  const date = now.toLocaleDateString('en-US', options);


  if (hour >= 5 && hour < 12) {
    greeting = 'good morning! :D';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'good afternoon!';
  } else if (hour >= 18 && hour < 22) {
    greeting = 'good evening :)';
  } else {
    greeting = 'good night zzz....';
  }

  const fadeAnim = React.useRef(
    new Animated.Value(0)
  ).current;

  const slideAnim = React.useRef(
    new Animated.Value(20)
  ).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.decorativeCircleOne} />
      <View style={styles.decorativeCircleTwo} />

      <View style={styles.header}>
        <Text style={styles.logo}>checkmate</Text>
        <Pressable style={styles.menuButton}>
          <Text style={styles.menuText}>=</Text>
        </Pressable>
      </View>

      <Animated.View
        style={[
          styles.greeting,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim,
              },
            ],
          },
        ]}
      >
        <View>
          <Text style={styles.title}>{greeting}</Text>
          <Text style={styles.subtitle}>lets get things done :D</Text>
        </View>
        <Text style={styles.date}>{date} :D</Text>

      </Animated.View>

      <View style={styles.taskCardContainer}>
        <TaskCard />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        onPress={() => { }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: colors.secondary,

    marginTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,

    borderRadius: radius.xl,

    elevation: 4,
    shadowColor: colors.subtle,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  logo: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.primary,
  },

  menuButton: {
    width: 44,
    height: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: radius.md,
  },

  menuText: {
    fontSize: 24,
    color: colors.text,
  },

  greeting: {
    marginTop: spacing.xl,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',

    paddingHorizontal: spacing.md,

    alignSelf: 'center',
    width: '100%',
    maxWidth: 800,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 17,
    color: colors.subtle,
  },

  date: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 4,
    textAlign: 'right',
  },

  decorativeCircleOne: {
    position: 'absolute',

    width: 220,
    height: 220,
    borderRadius: 110,

    backgroundColor: colors.primaryLight,

    right: -100,
    top: 100,

    opacity: 0.45,
  },

  decorativeCircleTwo: {
    position: 'absolute',

    width: 140,
    height: 140,
    borderRadius: 70,

    backgroundColor: colors.primarySoft,

    left: -70,
    bottom: 180,

    opacity: 0.5,
  },

  taskCardContainer: {
    flex: 1,

    marginTop: spacing.xl,

    alignItems: 'center',
  },

  addButton: {
    position: 'absolute',

    right: 20,
    bottom: 24,

    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: colors.primary,

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 5,

    shadowColor: colors.primary,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  addButtonText: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.card,
    lineHeight: 34,
  },

  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.9 }],
  },
});