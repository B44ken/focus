
import firebase from 'firebase/compat/app'
import { get, getDatabase, ref, remove, set } from 'firebase/database'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyClROcctTLva8nMlP7R-AzuueGiz_9U8J8",
    authDomain: "focus-d94c9.firebaseapp.com",
    databaseURL: "https://focus-d94c9-default-rtdb.firebaseio.com",
    projectId: "focus-d94c9",
    storageBucket: "focus-d94c9.appspot.com",
    messagingSenderId: "204472118325",
    appId: "1:204472118325:web:c32bf0ffc0c31c55f2d57c",
    measurementId: "G-1P61N0LJG3",
}

if (!firebase.apps.length)
    firebase.initializeApp(firebaseConfig)

const db = getDatabase(), auth = getAuth(), provider = new GoogleAuthProvider()

export type UserData = {
    logout: () => void
    day: (when: Date | 'today', add?: number, goal?: number) => { done: number, goal: number }
    task: (when: Date | 'today', body?: string, add?: number, goal?: number) => { body: string, done: number, goal: number }[] | undefined
}
export const getUser = async (setUser: (user: UserData) => void): Promise<UserData> => {
    if (!auth.currentUser)
        await signInWithPopup(auth, provider)

    const root = (...s: string[]) => ref(db, ['users', auth.currentUser?.uid, ...s].join('/'))

    const date = (day = 'today' as Date | 'today', hoursOff = -10) =>
        day instanceof Date
            ? day.toISOString().slice(0, 10)
            : new Date(Date.now() + 36e5 * hoursOff).toISOString().slice(0, 10)

    const days = (await get(root('days'))).val(), tasks = (await get(root('tasks'))).val()

    if (days == null) {
        await set(root(), { days: { [date('today')]: { goal: 60 * 60, done: 0 } } })
        return getUser(setUser)
    }

    const day = (when: Date | 'today', add = 0, goal = null as number | null): { done: number, goal: number } => {
        const prev = days[date(when)]
        const done = (prev?.done || 0) + add
        const g = goal || prev?.goal || 60 * 60
        if (add > 0) {
            set(root('days', date(when)), { goal, done })
                .then(async () => setUser(await getUser(setUser)))
            console.log({ when, add, goal, done, g })
        }
        return { done, goal: g }
    }

    const task = (when: Date | 'today', body?: string, add = 0, goal?: number): { body: string, done: number, goal: number }[] | undefined => {

        const prev = tasks[date(when)] || {}
        // tasks('today'): get todays task
        if (body == null) return prev

        const done = (prev?.done || 0) + add
        const g = goal || prev?.goal || 60 * 60
        const query = (goal == null) ?
            // tasks('today', 'new task', null): delete task
            remove(root('tasks', date(when), body)) :
            // tasks('today', 'new task', 60): new task
            set(root('tasks', date(when)), { goal, done, body })

        query.then(async () => setUser(await getUser(setUser)))
    }

    return { day, task, logout: auth.signOut }
}