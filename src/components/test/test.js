import React, { useContext, useState } from 'react';

// Create a UserContext with a default value
const UserContext = React.createContext("Guest");

function DisplayUser() {
  const user = useContext(UserContext); // Access the context value
  return <h1>User: {user}</h1>;
}

function UpdateUser() {
  const [user, setUser] = useContext(UserContext); // Destructure user and its setter
  const handleUpdate = () => setUser(prompt("Enter new username:", user));

  return <button onClick={handleUpdate}>Update User</button>;
}

function App2() {
  const [user, setUser] = useState("Guest"); // State for context value

  return (
    <UserContext.Provider value={[user, setUser]}>
      <DisplayUser />
      <UpdateUser />
    </UserContext.Provider>
  );
}

export default App2;