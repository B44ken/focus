
import { useEffect, setState } from 'react'

export const Account = ({ user, setUser }) => {


    useEffect(() => {
        user.mountUI('.login-button')
    }, [])

    return <>
        <div className="login-button" style={{
            display: user.user ? 'none' : 'block'
        }}></div>
        <div className="logged-in" style={{
            // display: user.user ? 'block' : 'none'
        }}>
            logged in as: {user.user || 'nobody'} (<a href="#" onClick={user?.logout}>logout</a>)
            <a onClick={() => console.log(user)}> test</a>
        </div>
    </>
}