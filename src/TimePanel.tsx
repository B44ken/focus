import { useEffect, useState } from 'react'
import { UserData } from './storage/db'

const formatMMSS = (s: number) => {
    const mm = Math.max(0, Math.floor(s / 60))
    const ss = Math.max(0, Math.floor(s % 60)).toString().padStart(2, '0')
    return `${mm}:${ss}`
}

export const TimePanel = ({ user, pickedTask }: { user: UserData, pickedTask: string | null }) => {
    const [start, setStart] = useState<number>(0)
    const [now, setNow] = useState<number>(0)

    useEffect(() => {
        const ci = setInterval(() => setNow(Date.now() / 1000), 1000)
        return () => clearInterval(ci)
    }, [now])

    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (start) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [start])

    const sum = start ? now - start : user.stats.get('today').done

    const accumulate = () => {
        user.stats.addTime('today', sum)
        if (pickedTask)
            user.tasks.addTime('today', pickedTask, sum)
        setStart(0)
    }

    return <>
        <div className="panel-header">
            <div>GOAL TODAY</div>
            <div>{formatMMSS(user.stats.get('today').goal)}</div>
        </div>

        <div className="timer-display"> {formatMMSS(sum)} </div>

        {pickedTask && <div className="text-center font-bold text-gray-500 mb-4">{pickedTask}</div>}

        <div className="control-group">
            {!start ? (
                <button className="btn-primary" onClick={() => setStart(now)}>START FOCUS</button>
            ) : (<>
                <button className="btn-secondary" onClick={() => setStart(0)}>CANCEL</button>
                <button className="btn-secondary" onClick={accumulate}>PAUSE</button>
            </>)}
        </div >

    </>
}

