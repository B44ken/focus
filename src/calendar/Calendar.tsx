import moment, { Moment } from 'moment'
import { useEffect, useState } from 'react'
import { UserData } from '../storage/db'

interface CalendarHeaderProps {
    date: Moment
    addMonth: (n: number) => () => void
}

const CalendarHeader = ({ date, addMonth }: CalendarHeaderProps) => {
    const month = date.format('MMMM').toLowerCase()
    const year = date.format('YYYY')

    return <div className="calendar-header">
        <div className="flex flex-col">
            <span className="text-sm font-bold uppercase tracking-widest text-gray-900">{month}</span>
            <span className="text-xs font-bold text-gray-400 font-mono mt-1">{year}</span>
        </div>
        <div className="flex gap-2">
            <button
                onClick={addMonth(-1)}
                className="calendar-nav-btn"
            >
                ←
            </button>
            <button
                onClick={addMonth(1)}
                className="calendar-nav-btn"
            >
                →
            </button>
        </div>
    </div>
}

interface CalendarDayProps {
    day: Moment
    data: UserData
}

const CalendarDay = ({ day, data }: CalendarDayProps) => {
    const [status, setStatus] = useState<'success' | 'fail' | 'future' | 'today'>('future')

    useEffect(() => {
        // Correctly using the data.day API which accepts Date object and returns { value, goal }
        const { done, goal } = data.day(day.toDate())

        const yesterday = moment().subtract(1, 'day')
        const isToday = day.isSame(moment(), 'day')

        if (isToday) {
            setStatus(done >= goal ? 'success' : 'today')
        } else if (done >= goal) {
            setStatus('success')
        } else if (day.isAfter(yesterday)) {
            setStatus('future')
        } else {
            setStatus('fail')
        }
    }, [day, data])

    const getColors = () => {
        switch (status) {
            case 'success': return 'success'
            case 'fail': return 'fail'
            case 'today': return 'today'
            default: return 'future'
        }
    }

    return <div className={`calendar-day ${getColors()}`}>
        {day.format('D')}
    </div>
}

interface CalendarBodyProps {
    date: Moment
    data: UserData
}

const CalendarBody = ({ date, data }: CalendarBodyProps) => {
    const dayElements = []
    for (let i = 0; i < date.daysInMonth(); i++) {
        const day = date.clone().date(1).add(i, 'day')
        dayElements.push(<CalendarDay day={day} key={day.format("YYYY-MM-DD")} data={data} />)
    }
    return <div className="grid grid-cols-7 gap-x-2 gap-y-2"> {dayElements} </div>
}

interface CalendarProps {
    data: UserData
}

export const Calendar = ({ data }: CalendarProps) => {
    const [date, setDate] = useState(moment().startOf('month'))
    const addMonth = (n: number) => () => setDate(date.clone().add(n, 'month'))

    return <div className="w-full">
        <CalendarHeader date={date} addMonth={addMonth} />
        <CalendarBody date={date} data={data} />
    </div>
}