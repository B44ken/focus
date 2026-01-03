import { Calendar } from './calendar/Calendar'
import { TimePanel } from './time/TimePanel'
import { TodoList } from './todo/TodoList'

import { ReactNode, useCallback, useEffect, useState } from 'react'
import { getUser, UserData } from './storage/db'

import 'firebaseui/dist/firebaseui.css'

const App = () => {
    const [user, setUser] = useState<UserData | null>(null)
    const init = async () => setUser(await getUser(setUser))

    return <>
        {user == null ? <section>
            <h1>Focus.</h1>
            <button onClick={init}> LOGIN WITH GOOGLE </button>
        </section> : <>
            <section>
                <TimePanel user={user} />
            </section>
            <section>
                <TodoList user={user} />
            </section>
            {/* <div className="border-t-2 border-gray-100 pt-8">
                    <Calendar />
                </div> */}
        </>
        }
    </>
}

export default App
