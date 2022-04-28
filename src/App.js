import * as React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

import Debits from "./components/Debits";

import axios from "axios";
import Credits from "./components/Credits";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0,
      debits: [],
      credits: [],
    };
  }

  async componentDidMount() {
    let debits = await axios.get("https://moj-api.herokuapp.com/debits");
    let credits = await axios.get("https://moj-api.herokuapp.com/credits");

    //get data from API response
    debits = debits.data;
    credits = credits.data;

    let debitSum = 0,
      creditSum = 0;
    debits.forEach((debit) => {
      debitSum += debit.amount;
    });
    credits.forEach((credit) => {
      creditSum += credit.amount;
    });

    let accountBalance = (creditSum - debitSum).toFixed(2);
    this.setState({ debits, credits, accountBalance});
  }

  addDebit = (e) => {
    //send to debits view via props
    //updates state based off user input
    e.preventDefault();
    let { debits } = this.state;
    let balance = this.state.accountBalance;

    const description = e.target[0].value;
    const amount = Number(e.target[1].value);
    const today = new Date();

    //formatting to match other dates
    const month = today.getMonth() + 1;
    const date =
      today.getFullYear().toString() +
      "-" +
      month.toString() +
      "-" +
      today.getDate().toString();

    const newDebit = { description, amount, date };
    balance = balance - amount;
    debits = [...debits, newDebit];
    this.setState({ debits: debits, accountBalance: balance });
  };
  addCredit = (e) => {
    //send to debits view via props
    //updates state based off user input
    e.preventDefault();
    let { credits } = this.state;
    let balance = this.state.accountBalance;

    const description = e.target[0].value;
    const amount = Number(e.target[1].value);
    const today = new Date();

    //formatting to match other dates
    const month = today.getMonth() + 1;
    const date =
      today.getFullYear().toString() +
      "-" +
      month.toString() +
      "-" +
      today.getDate().toString();

    const newCredit = { description, amount, date };
    balance = balance + amount;
    credits = [...credits, newCredit];
    this.setState({ credits, accountBalance: balance });
  };

  render() {
    return (
      <div className="App">
        <h1>Welcome to React Router!</h1>
        {/* <Navigate to="/" /> */}
        <Routes>
          <Route
            path="/debits"
            element={<Debits addDebit={this.addDebit} debits={this.state.debits} />}
          />
          <Route
            path="/credits"
            element={<Credits addCredit={this.addCredit} credits={this.state.credits} />}
          />
          <Route exact path="/" element={<Home />} />
        </Routes>
        <h3>$ {this.state.accountBalance}</h3>
      </div>
    );
  }
}


function Home() {
  return (
    <div>
      <h2>Welcome to the homepage!</h2>
      <Link to="/debits">Debits</Link> <br/>
      <Link to="/credits">Credits</Link><br/>
    </div>
  );
}


export default App;