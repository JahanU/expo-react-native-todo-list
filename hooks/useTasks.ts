import { useReducer, useEffect, useCallback, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserDefaults from '@alevy97/react-native-userdefaults'
import { sendCongratulationsNotification } from '../utils/notifications'

const STORAGE_KEY = '@todo_tasks'

export type Task = {
    id: string
    text: string
    completed: boolean
    createdAt: number
}

export type Filter = 'all' | 'active' | 'completed'

type TaskAction =
    | { type: 'LOAD'; payload: Task[] }
    | { type: 'ADD'; payload: Task }
    | { type: 'TOGGLE'; payload: string }
    | { type: 'DELETE'; payload: string }

function taskReducer(state: Task[], action: TaskAction): Task[] {
    switch (action.type) {
        case 'LOAD':
            return action.payload
        case 'ADD':
            return [action.payload, ...state]
        case 'TOGGLE':
            return state.map((task) =>
                task.id === action.payload ? { ...task, completed: !task.completed } : task
            )
        case 'DELETE':
            return state.filter((task) => task.id !== action.payload)
        default:
            return state
    }
}

export function useTasks() {
    const [tasks, dispatch] = useReducer(taskReducer, [])
    const [filter, setFilter] = useState<Filter>('all')
    const [isLoaded, setIsLoaded] = useState(false)

    // Load tasks from AsyncStorage on mount
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY)
                if (stored) {
                    dispatch({ type: 'LOAD', payload: JSON.parse(stored) })
                }
            } catch (error) {
                console.error('Failed to load tasks:', error)
            } finally {
                setIsLoaded(true)
            }
        }
        loadTasks()
    }, [])

    // Persist tasks to AsyncStorage whenever they change
    useEffect(() => {
        if (!isLoaded) return
        const saveTasks = async () => {
            try {
                // Save all tasks to async storage for main app
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))

                // Save uncompleted tasks to App Group UserDefaults for iOS Widget
                const uncompletedTasks = tasks.filter(t => !t.completed).slice(0, 5) // Top 5
                // @ts-expect-error set is not typed correctly in the community library but exists
                const sharedDefaults = new UserDefaults('group.com.jahan.exporntodo')
                // @ts-expect-error
                await sharedDefaults.set('widget_tasks', JSON.stringify(uncompletedTasks))
            } catch (error) {
                console.error('Failed to save tasks:', error)
            }
        }
        saveTasks()
    }, [tasks, isLoaded])

    const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks])

    const addTask = useCallback((text: string) => {
        const trimmed = text.trim()
        if (!trimmed) return
        const newTask: Task = {
            id: Date.now().toString(),
            text: trimmed,
            completed: false,
            createdAt: Date.now(),
        }
        dispatch({ type: 'ADD', payload: newTask })
    }, [])

    const toggleTask = useCallback((id: string) => {
        const taskToToggle = tasks.find(t => t.id === id)
        if (taskToToggle && !taskToToggle.completed && activeCount === 1) {
            sendCongratulationsNotification()
        }
        dispatch({ type: 'TOGGLE', payload: id })
    }, [tasks, activeCount])

    const deleteTask = useCallback((id: string) => {
        const taskToDelete = tasks.find(t => t.id === id)
        if (taskToDelete && !taskToDelete.completed && activeCount === 1) {
            sendCongratulationsNotification()
        }
        dispatch({ type: 'DELETE', payload: id })
    }, [tasks, activeCount])

    const filteredTasks = useMemo(() => {
        switch (filter) {
            case 'active':
                return tasks.filter((t) => !t.completed)
            case 'completed':
                return tasks.filter((t) => t.completed)
            default:
                return tasks
        }
    }, [tasks, filter])

    const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks])
    const totalCount = tasks.length

    return {
        tasks,
        filteredTasks,
        filter,
        setFilter,
        addTask,
        toggleTask,
        deleteTask,
        completedCount,
        totalCount,
        isLoaded,
    }
}
