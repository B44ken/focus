
import { useEffect, useState } from 'react'

export const Account = ({ user, setUser }) => {
    const [loggedIn, setLoggedIn] = useState(null)

    useEffect(() => {
        user.mountUI('.login-button')
    }, [])


    // god knows why setInterval is necessary
    setInterval(() => {
        if(user.id) setLoggedIn(user.id)
    }, 100)

    const logout = () => {
        user.logout()
        setLoggedIn(null)
        user.mountUI('.login-button')
    }
    
    return <div>
        <div className="login-button" style={{
            display: loggedIn ? 'none' : 'block'
        }}>
        </div>
        <div className="logged-in" style={{
            display: loggedIn ? 'block' : 'none'
        }}>
            logged in as: {user.user?.email || 'nobody'} (<a href="#" onClick={logout}>logout</a>)
        </div>
    </div>
}