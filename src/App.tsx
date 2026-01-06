import { Calendar } from './Calendar'
import { TimePanel } from './TimePanel'
import { GoalList } from './GoalList'

import { ReactNode, useCallback, useEffect, useState } from 'react'
import { getUser, UserData } from './storage/db'

import 'firebaseui/dist/firebaseui.css'

const App = () => {
    const [user, setUser] = useState<UserData | null>(null)
    const [pickedTask, setPickedTask] = useState<string | null>(null)
    const init = async () => setUser(await getUser(setUser))

    return <>
        {user == null ? <section>
            <h1>Focus.</h1>
            <button onClick={init}> LOGIN WITH GOOGLE </button>
        </section> : <>
            <section>
                <TimePanel user={user} pickedTask={pickedTask} />
            </section>
            <section>
                <GoalList user={user} pickedTask={pickedTask} setPickedTask={setPickedTask} />
            </section>
            <section>
                <Calendar user={user} />
            </section>
        </>
        }
    </>
}

export default App
