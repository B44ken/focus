
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

// Domain: Tasks
export type Task = {
    body: string;
    done: number;
    goal: number;
}

export type UserData = {
    logout: () => void;
    stats: {
        get: (when: Date | 'today') => { done: number, goal: number };
        addTime: (when: Date | 'today', seconds: number) => void;
        setGoal: (when: Date | 'today', seconds: number) => void;
    };
    tasks: {
        list: (when: Date | 'today') => Task[];
        create: (when: Date | 'today', body: string, goal: number) => void;
        addTime: (when: Date | 'today', body: string, seconds: number) => void;
        delete: (when: Date | 'today', body: string) => void;
    };
}

export const getUser = async (setUser: (user: UserData) => void): Promise<UserData> => {
    if (!auth.currentUser)
        await signInWithPopup(auth, provider)
    console.log('getUser() as ' + auth.currentUser?.uid)

    const root = (...s: string[]) => ref(db, ['users', auth.currentUser?.uid, ...s].join('/'))

    const date = (day = 'today' as Date | 'today', hoursOff = -10) =>
        day instanceof Date
            ? day.toISOString().slice(0, 10)
            : new Date(Date.now() + 36e5 * hoursOff).toISOString().slice(0, 10)

    const days = (await get(root('days'))).val() || {}, tasks = (await get(root('tasks'))).val() || {}

    if (Object.keys(days).length === 0) {
        await set(root(), { days: { [date('today')]: { goal: 60 * 60, done: 0 } } })
        return getUser(setUser)
    }

    const refresh = async () => setUser(await getUser(setUser))

    const stats = {
        get: (when: Date | 'today') => {
            const prev = days[date(when)]
            return { done: prev?.done || 0, goal: prev?.goal || 3600 }
        },
        addTime: (when: Date | 'today', seconds: number) => {
            const d = date(when)
            const prev = days[d] || { done: 0, goal: 3600 }
            set(root('days', d), { ...prev, done: prev.done + seconds }).then(refresh)
        },
        setGoal: (when: Date | 'today', seconds: number) => {
            const d = date(when)
            const prev = days[d] || { done: 0, goal: 3600 }
            set(root('days', d), { ...prev, goal: seconds }).then(refresh)
        }
    }

    const taskMethods = {
        list: (when: Date | 'today') => {
            const t = tasks[date(when)] || {}
            return Object.entries(t).map(([body, val]: [string, any]) => ({ body, ...val }))
        },
        create: (when: Date | 'today', body: string, goal: number) => {
            set(root('tasks', date(when), body), { goal, done: 0 }).then(refresh)
        },
        addTime: (when: Date | 'today', body: string, seconds: number) => {
            const d = date(when)
            const t = tasks[d]?.[body]
            if (t) {
                set(root('tasks', d, body), { ...t, done: t.done + seconds }).then(refresh)
            }
        },
        delete: (when: Date | 'today', body: string) => {
            remove(root('tasks', date(when), body)).then(refresh)
        }
    }

    return { logout: auth.signOut, stats, tasks: taskMethods }
}