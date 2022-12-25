import { useEffect, useState } from 'react'
import moment from 'moment'

export const TimePanel = ({ user }) => {
    const [timeToday, setTimeToday] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [running, setRunning] = useState(false)
    const [lastTick, setLastTick] = useState(Date.now())
    const [goalToday, setGoalToday] = useState(60)
    
    const today = moment().format('YYYY-MM-DD')

    const minutes = s => Math.floor(s / 60)
    const seconds = s => Math.floor(s % 60)

    const addTimeLeft = n => {
        let set = Math.max(timeLeft + n, 0)
        set = Math.min(set, 12 * 60 * 60)
        setTimeLeft(set)
    }

    useEffect(() => {
        const int = setInterval(() => {
            if(timeLeft > 0 && running) {
                const delta = (Date.now() - lastTick) / 1000
                setTimeLeft(timeLeft - delta)
                setLastTick(Date.now())
                
                const dbDay = user.readDay(today)
                setGoalToday(dbDay.goal * 60)
                const dbSecondsDone = dbDay.done * 60

                if(dbSecondsDone > timeToday)
                    setTimeToday(dbSecondsDone + delta)
                else
                    setTimeToday(timeToday + delta)

                user.writeDay(today, minutes(timeToday))
            }
            
            if(timeLeft === 0)
                setRunning(false)
            
            if(!running)
                setLastTick(Date.now())
        }, 1000)

        return () => clearInterval(int)
    }, [user, timeLeft, lastTick, running, timeToday, today])

    return <div className="time-panel">
        {minutes(timeToday)} / {minutes(goalToday)} min
        <br />
        <button onClick={() => addTimeLeft(-15 * 60)}>-</button>
        {minutes(timeLeft)} min {seconds(timeLeft)} s
        <button onClick={() => addTimeLeft(15 * 60)}>+</button>
        <button onClick={() => setRunning(!running)}>
            {running ? 'stop' : 'start'}
        </button>
    </div>
}