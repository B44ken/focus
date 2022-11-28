import { useEffect, useState } from 'react'

const dailyGoal = 120 * 60

export const TimePanel = () => {
    const [timeToday, setTimeToday] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0) 
    const [running, setRunning] = useState(false)

    const addTimeLeft = n => {
        let set = Math.max(timeLeft + n, 0)
        set = Math.min(set, 12 * 60 * 60)
        setTimeLeft(set)
    }

    const minutes = seconds => Math.floor(seconds / 60)
    const seconds = seconds => seconds % 60

    useEffect(() => {
        const int = setInterval(() => {

            if(timeLeft > 0 && running) {
                setTimeToday(timeToday + 1)
                setTimeLeft(timeLeft - 1)
            }
            if(timeLeft == 0) {
                setRunning(false)
            }
        }, 1000)

        return () => clearInterval(int)
    }, [timeLeft, timeToday, running])

    return <div className="time-panel">
        {minutes(timeToday)} / {minutes(dailyGoal)} min
        <br />
        <button onClick={ () => addTimeLeft(-15 * 60) }>-</button>
        { minutes(timeLeft) } min { seconds(timeLeft) } s
        <button onClick={ () => addTimeLeft(15 * 60) }>+</button>
        <button onClick={ () => setRunning(!running) }>
            { running ? 'stop' : 'start' }
        </button>
    </div>
}