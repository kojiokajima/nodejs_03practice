import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'react-materialize'
import '../../index.css'
import '../../App.css'

const Home = () => {



    return (
        <div className="App">
            <h1>HOOOOOOOOOOOOOME</h1>
            <Link to="/signup">
                <Button node="button" style={{marginRight: '5px'}} waves="light">
                    Sign Up
                </Button>
            </Link>
            <Link to="signin">
                <Button node="button" style={{marginRight: "5px"}} waves="light">
                    Sign In
                </Button>
            </Link>
        </div>
    )
}

export default Home