export const CalendarHeader = ({ date, addMonth }) => {
    const month = date.format('MMMM YYYY').toLowerCase()
    const monthPrev = date.clone().subtract(1, 'month').format('MMMM').toLowerCase()
    const monthNext = date.clone().add(1, 'month').format('MMMM').toLowerCase()

    return <div className="calendar-header">
        <button onClick={addMonth(-1)}> {monthPrev} </button>
        <span> {month} </span>
        <button onClick={addMonth(1)}> {monthNext} </button>
    </div>
}