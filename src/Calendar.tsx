import { useEffect, useState } from 'react'
import { UserData } from './storage/db'


// const CalendarHeader = ({ date, addMonth }: CalendarHeaderProps) => {
//     return <div className="calendar-header">
//         <div className="flex flex-col">
//             <span className="text-sm font-bold uppercase tracking-widest text-gray-900">{date.format('MMMM').toLowerCase()}</span>
//             <span className="text-xs font-bold text-gray-400 font-mono mt-1">{date.format('YYYY')}</span>
//         </div>
//         <div className="flex gap-2">
//             <button onClick={addMonth(-1)} className="calendar-nav-btn">←</button>
//             <button onClick={addMonth(1)} className="calendar-nav-btn">→</button>
//         </div>
//     </div>
// }

const monthNames = [null, 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const CalendarBody = ({ children }: { children: React.ReactNode }) => {
    return <div className="grid grid-cols-7 gap-0 w-2/3"> {children} </div>
}

const CalendarHeader = ({ month, setMonth }: { month: number[], setMonth: (month: number[]) => void }) => {
    const prev = month[1] == 1 ? [month[0] - 1, 12] : [month[0], month[1] - 1]
    const next = month[1] == 12 ? [month[0] + 1, 1] : [month[0], month[1] + 1]

    return <div className="flex justify-between items-center font-bold font-mono mb-1">
        <a className="cursor-pointer underline" onClick={() => setMonth(prev)}>{monthNames[prev[1]]} {prev[0]}</a>
        <p className='text-gray-900'>{monthNames[month[1]]} {month[0]}</p>
        <a className="cursor-pointer underline" onClick={() => setMonth(next)}>{monthNames[next[1]]} {next[0]}</a>
    </div>
}

const CalendarDay = ({ date, fraction }: { date: [number, number, number], fraction: number }) =>
    <div className={`calendar-day ${fraction >= 1 ? 'bg-gray-900 text-white' : ''}`}> {date[2]} </div>

export const Calendar = ({ user }: { user: UserData }) => {
    const [month, setMonth] = useState([2026, 1])
    const daysInMonth = new Date(month[0], month[1], 0).getDate()

    return <>
        <CalendarHeader month={month} setMonth={setMonth} />
        <CalendarBody>
            {Array.from({ length: daysInMonth }, (_, i) => {
                const { done, goal } = user.stats.get(new Date(`${month[0]}-${month[1]}-${i + 1}`))
                const fraction = done / (goal || 3600)
                return <CalendarDay fraction={fraction} key={i} date={[month[0], month[1], i + 1]} />
            })}
        </CalendarBody>
    </>
}