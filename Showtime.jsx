import React from 'react';
import {Decider} from './Decider';
import './styles.css';

class Showtime extends React.Component {
    decider = null;
    users = null;
    invalidLocations = {};
    constructor(props){
        super(props);
        this.state = {
            loadedVenues: false,
            loadedUsers: false,
            validLocations: [],
            selectedUsers: []
        }
        this.evalUsers = this.evalUsers.bind(this);
        this.addUser = this.addUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
    }
    componentDidMount(){
        fetch('./venues.json')
        .then(res=>res.json())
        .then(locations=>{
            this.decider = new Decider(locations, this.analyseFeedback.bind(this));
            this.setState({loadedVenues:true})
        })

        fetch('./users.json')
        .then(res=>res.json())
        .then(data=>{
            this.users = data;
            this.setState({loadedUsers:true});
        })
    }
    analyseFeedback(validLocations, invalidLocations){
        this.invalidLocations = invalidLocations;
        this.setState({validLocations});
    }
    evalUsers(){
        this.decider.getDecision(this.state.selectedUsers);
    }
    renderInvalidLocations(){
        if(Object.keys(this.invalidLocations).length){
            return  (
                <div>
                    <h2>Avoid</h2>
                    {Object.keys(this.invalidLocations).map(loc=>{
                        return (<div key={loc}>
                            <p>{loc}</p>
                            <ul>{this.invalidLocations[loc].map((note,i)=><li key={i}>{note}</li>)}</ul>
                            </div>)
                    })}
                </div>
            );
        }
    }
    addUser(e){
        const newUser = this.users.find(u=>u.name == e.target.value);
        const usersList = this.state.selectedUsers;
        usersList.push(newUser);
        this.setState({selectedUsers:usersList})
    }
    removeUser(e){
        const usersList = this.state.selectedUsers;
        const filteredList = usersList.filter(u=>{
            return u.name !== e.target.dataset.name;
        });
        this.setState({selectedUsers:filteredList})
    }
    renderApprovedLocations(){
        if(this.state.validLocations.length){
            return (
                <div>
                    <h2>You can go to..</h2>
                    {this.state.validLocations.map(r=><p key={r}>✅ {r}</p>)}
                </div>
            )
        }
    }
    render() {
        if(!this.state.loadedUsers || !this.state.loadedVenues){
            return <div>Loading..</div>
        }
        
      return <div className="continer">
          <div className="selector">
            <select onChange={this.addUser}>
                <option value="Select.."></option>
                {this.users.map(u=>{
                    return <option key={u.name}>{u.name}</option>
                })}
            </select>
            <button onClick={this.evalUsers}>Where we going?</button>
          </div>
          <ul className="users">
            {this.state.selectedUsers.map(u=>{
                return <li key={u.name}>{u.name} <button data-name={u.name} onClick={this.removeUser}>❌</button></li>
            })}
          </ul>
          <div className="locations">
            {this.renderApprovedLocations()}
            {this.renderInvalidLocations()}
          </div>
      </div>;
    }
}

export default Showtime;