import './App.css'
import { Calendar } from './calendar/Calendar'
import { Account } from './storage/Account'
import { TimePanel } from './time/TimePanel'

export default () => {
    return <main>
        <Account />
        <TimePanel />
        <Calendar/>
    </main>
}