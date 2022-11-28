export const CalendarHeader = ({ date, addMonth }) => {
    const month = date.format('MMMM YYYY').toLowerCase()
    const monthPrev = date.clone().subtract(1, 'month').format('MMMM').toLowerCase()
    const monthNext = date.clone().add(1, 'month').format('MMMM').toLowerCase()

    const year = date.format('YYYY')
    return <div className="calendar-header">
        <a onClick={addMonth(-1)}> { monthPrev } </a>
        <span> { month } </span>
        <a onClick={addMonth(1)}> { monthNext } </a>
    </div>
}