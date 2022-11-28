import { queryDay } from '../time/store.js'
import moment from 'moment'

const CalendarDay = ({ day }) => {
    const { goal, time } = queryDay(day)
    let colour = 'green'
    if(day >= moment().startOf('day')) colour = 'grey'
    else if(time < goal) colour = '#f73c1d'

    return <div className='calendar-day' style = { { backgroundColor: colour } }>
        <div>{ day.format('D') }</div>
    </div>
    // return <div className="calendar-day"> { date } ! </div>
}

export const CalendarBody = ({ date }) => {
    const dayElements = []
    for(let i = 0; i < date.daysInMonth(); i++) {
        const day = date.clone().add(i, 'day')
        dayElements.push(<CalendarDay day={day} key={i} />)
    }

    return <div className="calendar-body"> { dayElements } </div>
}