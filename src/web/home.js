import { useEffect, useState } from "react";
import Loading from '../components/Loading'
import {auth} from '../components/Firebase'
import { onAuthStateChanged } from "firebase/auth";

function Home() {

    const [currentUser,setCurrentUser] = useState(null);
    const [loaded,isLoaded] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({"email":user.email, "nombre":user.displayName})
              };
              fetch(process.env.REACT_APP_BASE_URL + "login/", requestOptions).then
              (response => response.json()).then
              ((data) => {
                setCurrentUser(data)
                isLoaded(true)
              })
            }
        })
      }, [])
    
    if(!loaded){
        return <Loading />
    }else{
        return(
            <>
                Home {currentUser.email}
            </>
        )
    }
}

export default Home;