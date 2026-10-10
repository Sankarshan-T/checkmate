
import React, { useEffect } from 'react';

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
import AddTaskModal from './src/components/AddTaskModal';

import {
  loadTasks,
  saveTasks,
  type Task,
} from './src/storage/taskStorage';

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

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [tasksLoaded, setTasksLoaded] = React.useState(false);
  const [storageError, setStorageError] = React.useState(false);

  const [addTaskVisible, setAddTaskVisible] =
    React.useState(false);

  // load the saved tasks once when the app starts
  useEffect(() => {
    let isActive = true;

    async function initializeTasks() {
      try {
        const savedTasks = await loadTasks();

        if (isActive) {
          setTasks(savedTasks);
          setStorageError(false);
        }
      } catch (error) {
        console.error('Could not load saved tasks:', error);

        if (isActive) {
          setStorageError(true);
        }
      } finally {
        if (isActive) {
          setTasksLoaded(true);
        }
      }
    }

    initializeTasks();

    return () => {
      isActive = false;
    };
  }, []);

  // save whenever the task list changes, but doesnt overwrite saved data before loading has finished 
  useEffect(() => {
    if (!tasksLoaded || storageError) {
      return;
    }

    saveTasks(tasks).catch(error => {
      console.error('Could not save tasks:', error);
      setStorageError(true);
    });
  }, [tasks, tasksLoaded, storageError]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      completed: false,
      completionHistory: [],
    };

    setTasks(currentTasks => [...currentTasks, newTask]);
    setAddTaskVisible(false);
  };

  const deleteTask = (id: string) => {
    setTasks(currentTasks =>
      currentTasks.filter(task => task.id !== id),
    );
  };

  const toggleTask = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);

    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id !== id) {
          return task;
        }

        const completing = !task.completed;

        return {
          ...task,
          completed: completing,
          completionHistory: completing
            ? [...task.completionHistory, today]
            : task.completionHistory,
        };
      }),
    );
  };

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
    new Animated.Value(0),
  ).current;

  const slideAnim = React.useRef(
    new Animated.Value(20),
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
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.decorativeCircleOne} />
      <View style={styles.decorativeCircleTwo} />

      <View style={styles.header}>
        <Text style={styles.logo}>checkmate</Text>

        <Pressable
          style={styles.menuButton}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Text style={styles.menuText}>=</Text>
        </Pressable>
      </View>

      <Animated.View
        style={[
          styles.greeting,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View>
          <Text style={styles.title}>{greeting}</Text>
          <Text style={styles.subtitle}>
            lets get things done :D
          </Text>
        </View>

        <Text style={styles.date}>{date} :D</Text>
      </Animated.View>

      {storageError && (
        <Text style={styles.storageWarning}>
          Couldn't access saved tasks. Your changes may not be saved.
          Restart the app or check device storage before editing tasks.
        </Text>
      )}

      <View style={styles.taskCardContainer}>
        {tasksLoaded ? (
          <TaskCard
            tasks={tasks}
            onRequestAddTask={() => setAddTaskVisible(true)}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        ) : (
          <Text style={styles.loadingText}>Loading your tasks...</Text>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        onPress={() => setAddTaskVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Add task"
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

      <AddTaskModal
        visible={addTaskVisible}
        onClose={() => setAddTaskVisible(false)}
        onAddTask={addTask}
      />
    </View>
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
    shadowOffset: { width: 0, height: 3 },
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

  loadingText: {
    marginTop: spacing.xl,
    color: colors.muted,
    fontSize: 16,
  },

  storageWarning: {
    marginTop: spacing.md,
    color: '#B3261E',
    fontSize: 13,
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
    shadowOffset: { width: 0, height: 3 },
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
