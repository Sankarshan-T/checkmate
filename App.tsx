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

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: colors.secondary,

    marginTop: spacing.xxl,
    padding: spacing.md,
    borderRadius: radius.xxl,

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
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },

  date: {
    fontSize: 22,
    color: colors.muted,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B1B1B',
    marginBottom: 4,
  },

  menuButton: {
    padding: spacing.sm,
  },

  menuText: {
    fontSize: 24,
    color: '#1B1B1B',
  },

  greeting: {
    marginTop: spacing.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },

  subtitle: {
    fontSize: 18,
    color: colors.subtle,
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
    opacity: 0.50,
  },

  taskCardContainer: {
    marginVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
})