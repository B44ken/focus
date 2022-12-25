import { useEffect, useState } from 'react'

export const Account = ({ user, setUser }) => {
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        user.mountUI('.login-button', setUser)
        setLoggedIn(user.user?.uid != null)
    }, [user, setUser])

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
            logged in as: <br /> 
            {user.user?.email || 'nobody'} <br />
            (<a href="#" onClick={logout}>logout</a>)
        </div>
    </div>
}