import './App.css'
import { Calendar } from './calendar/Calendar'
import { Account } from './storage/Account'
import { TimePanel } from './time/TimePanel'

import { useState } from 'react'
import { FirebaseUser } from './storage/user'

export default () => {
    const [user, setUser] = useState(new FirebaseUser())

    return <main>
        <Account user={user} setUser={setUser} />
        <TimePanel user={user} />
        <Calendar user={user} />
    </main>
}