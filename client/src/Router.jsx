import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {Dashboard, Home, SignUp, SignIn} from './components/index'

const Router = () => {
    return (
        <Switch>
            <Route exact path='(/)?' component={Home} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/signin' component={SignIn} />
            <Route exact path='/dashboard/:id' component={Dashboard} />
        </Switch>
    )
}

export default Router