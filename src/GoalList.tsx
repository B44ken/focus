import { useEffect, useRef } from 'react'
import { UserData } from './storage/db'

export const GoalList = ({ user, pickedTask, setPickedTask }: { user: UserData, pickedTask: string | null, setPickedTask: (s: string | null) => void }) => {
    const time = 3600;

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Just reading stats to ensure data is loaded, though likely not strictly needed if App handles init
        user.stats.get('today')
    }, [])

    const addTask = () => {
        if (!inputRef.current?.value.trim()) return
        user.tasks.create('today', inputRef.current.value.trim(), time)
        inputRef.current.value = ''
    }

    const tasks = user.tasks.list('today')

    return <>
        <div className="task-input-group">
            <input className="task-input-name" type="text" ref={inputRef} placeholder='ADD A GOAL' onKeyDown={e => e.key === 'Enter' && addTask()} />
            <button className="aspect-square mt-0 p-3" onClick={addTask}>+</button>
        </div>
        <div className="task-list">
            {tasks.map(({ body, goal, done }) => (
                <div key={body}
                    className={`task-item ${pickedTask === body ? 'active' : ''}`}
                    onClick={() => setPickedTask(pickedTask === body ? null : body)}>
                    <div>
                        <span className="task-item-name">{body}</span>
                        <div className="task-item-est">
                            {Math.floor(done / 60)} / {Math.floor(goal / 60)} MIN
                        </div>
                    </div>
                    {/* Placeholder for delete button if needed later, logic in db.ts implies setting goal to null deletes it */}
                    <div className="task-delete-btn" onClick={(e) => {
                        e.stopPropagation();
                        user.tasks.delete('today', body)
                    }}>DELETE</div>
                </div>
            ))}
        </div>
    </>
}