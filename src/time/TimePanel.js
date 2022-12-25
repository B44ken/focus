import userEvent from '@testing-library/user-event'
import { useEffect, useState } from 'react'
import moment from 'moment'

const dailyGoal = 120 * 60

export const TimePanel = ({ user }) => {
    const [timeToday, setTimeToday] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [running, setRunning] = useState(false)
    const [lastTick, setLastTick] = useState(Date.now())

    const today = moment().format('YYYY-MM-DD')

    const addTimeLeft = n => {
        let set = Math.max(timeLeft + n, 0)
        set = Math.min(set, 12 * 60 * 60)
        setTimeLeft(set)
    }

    const minutes = seconds => Math.floor(seconds / 60)
    const seconds = seconds => Math.floor(seconds % 60)

    useEffect(() => {
        const int = setInterval(() => {
            if (timeLeft > 0 && running) {
                const delta = (Date.now() - lastTick) / 1000
                setTimeToday(timeToday + delta)
                setTimeLeft(timeLeft - delta)

                if(timeToday % 60 <= 1)
                    user.writeDay(today, minutes(timeToday))
            }
            if (timeLeft === 0)
                setRunning(false)

            setLastTick(Date.now())
        }, 1000)

        return () => clearInterval(int)
    }, [timeLeft, timeToday, running])

    return <div className="time-panel">
        {minutes(timeToday)} / {minutes(dailyGoal)} min
        <br />
        <button onClick={() => addTimeLeft(-15 * 60)}>-</button>
        {minutes(timeLeft)} min {seconds(timeLeft)} s
        <button onClick={() => addTimeLeft(15 * 60)}>+</button>
        <button onClick={() => setRunning(!running)}>
            {running ? 'stop' : 'start'}
        </button>
    </div>
}