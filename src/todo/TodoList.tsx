import { useState } from 'react'
import { UserData } from '../storage/db'

export const TodoList = ({ user }: { user: UserData }) => {
    // const [newTaskName, setNewTaskName] = useState('')
    // const [newEst, setNewEst] = useState(30)

    // // Derived from props, no need for local state syncing/effect
    // const tasks = data.tasks || []

    // const addTask = () => {
    //     if (!newTaskName.trim() || !user) return
    //     const newTask: Task = {
    //         id: Date.now().toString(),
    //         name: newTaskName,
    //         estimatedMins: newEst
    //     }
    //     const updated = [...tasks, newTask]
    //     saveTasks(user.uid, updated)
    //     setNewTaskName('')
    // }

    // const deleteTask = (e: React.MouseEvent, taskId: string) => {
    //     e.stopPropagation()
    //     if (!user) return
    //     const updated = tasks.filter(t => t.id !== taskId)
    //     saveTasks(user.uid, updated)
    //     if (activeTaskId === taskId) {
    //         onTaskSelect(undefined)
    //     }
    // }

    // Convert the potential object return (if db.ts is lying about array) to an array safely
    const rawTasks = user.task('today')
    // @ts-ignore: handling db.ts return type mismatch if it returns object map
    const tasks: any[] = Array.isArray(rawTasks) ? rawTasks : rawTasks ? Object.values(rawTasks) : []

    const [newTaskName, setNewTaskName] = useState('')
    const [newEst, setNewEst] = useState(30)
    const [activeTaskId, setActiveTaskId] = useState<string | undefined>(undefined)

    // Using body as ID since that seems to be how the DB is structured (keyed by body)
    const onTaskSelect = (taskId: string | undefined) => setActiveTaskId(taskId)

    const addTask = () => {
        if (!newTaskName.trim()) return
        user.task('today', newTaskName, 0, newEst * 60)
        setNewTaskName('')
    }

    const deleteTask = (e: React.MouseEvent, name: string) => {
        e.stopPropagation()
        // goal=null deletes the task
        user.task('today', name, 0, null as any)
        if (activeTaskId === name) {
            onTaskSelect(undefined)
        }
    }

    return <>
        <h3 className="task-title">TASKS</h3>

        <div className="task-input-group">
            <input
                className="task-input-name"
                type="text"
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                placeholder="New Task..."
            />
            <div className="task-input-est-wrapper">
                <input
                    className="task-input-est"
                    type="number"
                    value={newEst}
                    onChange={e => setNewEst(parseInt(e.target.value) || 0)}
                />
                <span className="text-gray-400 text-xs font-bold">MIN</span>
            </div>
            <button
                className="bg-gray-900 text-white px-4 font-bold hover:bg-black transition-colors"
                onClick={addTask}
            >
                +
            </button>
        </div>

        <ul className="task-list">
            {tasks.map((task: any) => (
                <li
                    key={task.body}
                    className={`task-item ${task.body === activeTaskId ? 'active' : ''}`}
                    onClick={() => onTaskSelect(task.body === activeTaskId ? undefined : task.body)}
                >
                    <div className="flex-1">
                        <span className="task-item-name">
                            {task.body}
                        </span>
                        <span className="task-item-est">
                            {Math.round((task.goal || 0) / 60)}m
                        </span>
                    </div>

                    <button
                        className="task-delete-btn"
                        onClick={(e) => deleteTask(e, task.body)}
                    >
                        Delete
                    </button>
                </li>
            ))}
            {tasks.length === 0 && (
                <li className="text-gray-400 italic text-sm text-center py-4">
                    No tasks yet. Add one above.
                </li>
            )}
        </ul>
    </>
}



