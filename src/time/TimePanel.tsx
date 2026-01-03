import { useEffect, useState } from 'react'
import { UserData } from '../storage/db'

const formatMMSS = (s: number) => {
    const mm = Math.max(0, Math.floor(s / 60))
    const ss = Math.max(0, Math.floor(s % 60)).toString().padStart(2, '0')
    return `${mm}:${ss}`
}

export const TimePanel = ({ user }: { user: UserData }) => {
    const [start, setStart] = useState<number>(0)
    const [now, setNow] = useState<number>(0)

    useEffect(() => {
        const ci = setInterval(() => setNow(Date.now() / 1000), 1000)
        return () => clearInterval(ci)
    }, [now])

    const sum = start ? now - start : user.day('today').done

    const accumulate = () => {
        user.day('today', sum)
        setStart(0)
    }

    return <>
        <div className="panel-header">
            <div>GOAL TODAY</div>
            <div>{formatMMSS(user.day('today').goal)}</div>
        </div>

        <div className="timer-display"> {formatMMSS(sum)} </div>

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

