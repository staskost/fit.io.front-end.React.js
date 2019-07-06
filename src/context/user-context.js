import React from 'react';

const UserContext = React.createContext({
    isLoggedIn: false,
    token: '',
    userInfo: {},
    updateUserContext: () => {}
});

export default UserContext;