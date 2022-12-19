import { useEffect, useState } from 'react'
import moment from 'moment'


const CalendarDay = ({ day, user }) => {

    const [color, setColor] = useState('lightgrey')

    useEffect(() => {
        const dayData = user.readDay(day.format('YYYY-MM-DD'))
        if(dayData.done >= dayData.goal) setColor('lightgreen')
        else if(day.isAfter(moment())) setColor('lightgrey')
        else setColor('lightcoral')
    })


    return <div className='calendar-day' style={{ backgroundColor: color }}>
        <div>{day.format('D')}</div>
    </div>
}

export const CalendarBody = ({ date, user }) => {
    const dayElements = []
    for (let i = 0; i < date.daysInMonth(); i++) {
        const day = date.clone().add(i, 'day')
        dayElements.push(<CalendarDay day={day} key={day.format("YYYY-MM-DD")} user={user} />)
    }
    return <div className="calendar-body"> {dayElements} </div>
}