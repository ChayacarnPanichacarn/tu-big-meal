import {createContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
// import { layer } from '@fortawesome/fontawesome-svg-core';
//This file exports 2 object

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const response = await fetch('https://tu-big-meal.onrender.com/userInfo',{
                    method: 'GET',
                    credentials: 'include' //Include HttpOnly cookies
                });

                if(response.ok){
                    const data = await response.json();
                    // console.log("Fetched User: ",data.user);
                    setUser(data.user);
                }
            }catch(error){
                console.error("Failed to fetch user: ", error)
            }finally{
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if(loading){
        return <div>Loading.......</div>;
    }

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired
}

// export default UserProvider;