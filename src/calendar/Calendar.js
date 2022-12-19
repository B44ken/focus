import moment from 'moment'
import { CalendarBody } from './CalendarBody'
import { CalendarHeader } from './CalendarHeader'
import { useState } from 'react'

export const Calendar = ({ user }) => {
    const [date, setDate] = useState(moment().startOf('month'))
    const addMonth = (n) => () => setDate(date.clone().add(n, 'month'))

    return <div className="calendar">
        <CalendarHeader date={date} addMonth={addMonth} />
        <CalendarBody date={date} addMonth={addMonth} user={user} />
    </div>
}