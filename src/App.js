import "./App.css";
import React, {useEffect, useState} from "react";
import web3 from "./web3";
import lottery from './lottery'; 



const App = () => {

const [data, setData] = useState({
  manager: '',
  players: [],
  balance: '',
  value: '',
}); 

const [message, setMessage] = useState(''); 

useEffect(() => {

  const callManager = async () => { 
    await lottery.methods.manager().call(); 
  }

  const callPlayers = async () => {
    await lottery.methods.getPlayers().call(); 
  }

  const getBalance = async () => { await web3.eth.getBalance(lottery.options.address); }

  const mn = callManager(); 
  const players = callPlayers();
  const balance = getBalance(); 


  setData({...data, mn, players, balance}); 
},[data])

const onSubmit = async (event) => {
  event.preventDefault();

  const accounts = await web3.eth.getAccounts();

  setMessage('Waiting on transaction success...');

  await lottery.methods.enter().send({
    from: accounts[0],
    value: web3.utils.toWei(data.value, 'ether')
  })

  setMessage('You have been entered!');

}


    return (
      <div className="App">
    <h2>Lottery Contract</h2>
    <p>This contract is managed by {data.manager}
    There are currently {data.players.length} people entered, competing to win {web3.utils.fromWei(data.balance, 'ether')} ether!</p>
<hr />

<form onSubmit={onSubmit}>
  <h4>
    Want to try your luck?
  </h4>
  <div>
    <label>
      <input onChange={event => setData({value: event.target.value}) } />
      </label>
  </div>
  <button>Enter</button>
</form>
<hr />
<h1>{message}</h1>
      </div>
    );
}
export default App;
