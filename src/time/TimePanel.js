import { useEffect, useState } from 'react'
import moment from 'moment'

export const TimePanel = ({ user, setStatus }) => {
    const [timeToday, setTimeToday] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [running, setRunning] = useState(false)
    const [lastTick, setLastTick] = useState(Date.now())
    const [goalToday, setGoalToday] = useState(60)

    const today = moment().format('YYYY-MM-DD')

    useEffect(() => {
        if(user.loggedIn) {
            const dbDay = user.readDay(today)
            setGoalToday(dbDay.goal * 60)
            setTimeToday(dbDay.done * 60)
        }
    }, [user.loggedIn])

    const minutes = s => Math.max(0, Math.floor(s / 60))
    const seconds = s => Math.max(0, Math.floor(s % 60))

    const addTimeLeft = n => {
        let set = Math.max(timeLeft + n, 0)
        set = Math.min(set, 12 * 60 * 60)
        setTimeLeft(set)
    }

    const doTick = () => {
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

    useEffect(() => {
        const int = setInterval(() => {
            if(running) doTick()
            else setLastTick(Date.now())
            
            if(timeLeft < 0) {
                setRunning(false)
                setTimeLeft(0)
            }
        }, 500)

        return () => clearInterval(int)
    }, [user, timeLeft, lastTick, running, timeToday, today])

    if(running)
        setStatus('focus (' + minutes(timeLeft) + ' m ' + seconds(timeLeft) + 's)')
    else setStatus('focus')

    return <div className="time-panel">
        {minutes(timeToday)} / {minutes(goalToday)} m
        <br />
        <button onClick={() => addTimeLeft(-15 * 60)}>-</button>
        {minutes(timeLeft)} m {seconds(timeLeft)} s
        <button onClick={() => addTimeLeft(15 * 60)}>+</button>
        <button onClick={() => addTimeLeft(15)}>.</button>
        <button onClick={() => setRunning(!running)}>
            {running ? 'stop' : 'start'}
        </button>
    </div>
}
