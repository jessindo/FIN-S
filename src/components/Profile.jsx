import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile
} from 'blockstack';


import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';


const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const data= [
  {name: 'Jan', budget: 750, expenses: 430},
  {name: 'Feb', budget: 550, expenses: 500},
  {name: 'Mar', budget: 780, expenses: 576},
  {name: 'Apr', budget: 400, expenses: 230},
  {name: 'May', budget: 500, expenses: 0},
  {name: 'Jun', budget: 500, expenses: 0},
  {name: 'Jul', budget: 500, expenses: 0},
  {name: 'Aug', budget: 500, expenses: 0},
  {name: 'Sep', budget: 500, expenses: 0},
  {name: 'Oct', budget: 500, expenses: 0},
  {name: 'Nov', budget: 500, expenses: 0},
  {name: 'Dec', budget: 500, expenses: 0}
];


export default class Profile extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      person: {
        name() {
          return 'Anonymous';
        },
        avatarUrl() {
          return avatarFallbackImage;
        },
      },  
      username: "",
      newBudget: "",
      newExpense: "",
      
      budgets: [],
      expenses: [],
      statusIndex: 0,

      isLoadingB: false,
      isLoadingE: false,

      budgettotal: 0,
      expensetotal: 0,

      localdata: data
    };
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const { username } = this.state;
 
    return (
      !isSignInPending() && person ?
      <div className="container" style={{width: "1400px"}}>
        <div className="row">
          <div className="col-md-6">
            <div className="col-md-12">
              <div className="avatar-section">
                <img
                  src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage }
                  className="img-rounded avatar"
                  id="avatar-image"
                />
                <div className="username">
                  <h1>
                    Hello, <span id="heading-name">{person.name() ? person.name()
                      : 'Nameless Person' }</span>
                    ! </h1>
                  <span>{username}</span>
                  <span>
                    &nbsp;::&nbsp;
                    <a onClick={ handleSignOut.bind(this) }>(LOGOUT)</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-6">
              <div className="col-lg-6 new-be">
                  <div>
                    <textarea className="input-be"
                      value={this.state.newBudget}
                      onChange={e => this.handleNewBudgetChange(e)}
                      placeholder="Enter a budget / source of income"
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      onClick={e => this.handleNewBudgetSubmit(e)}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="bes">
                    {this.state.isLoadingB && <span>Loading...</span>}
                    {this.state.budgets.map((budget, index) => (
                        <div className="be" key={budget.id}><h4>
                          <h4 style={{textAlign: "left"}}>{budget.note_}</h4> {budget.float_}
                            <img src={'https://img.icons8.com/office/16/000000/cancel.png'}
                            onClick={e=> this.handleDeleteBudget(index)}
                            style={{cursor: "pointer", paddingLeft: "1rem"}}/>
                          </h4>
                        </div>
                      )
                    )}
                  </div>
                  <div className="total">
                      {/* let {budtotal} = 0
                      {this.state.budgets.map((budget) => (
                            <div key={budget.id}><h4>
                               budtotal = budtotal + {budget.float_}
                              </h4>
                            </div>
                          )
                        )}
                        Total budget budtotal: {budtotal} */}
                        
                  </div>
              </div>
                      
              <div className="col-lg-6 new-be">
                <div>
                  <textarea className="input-be"
                    value={this.state.newExpense}
                    onChange={e => this.handleNewExpenseChange(e)}
                    placeholder="Enter an expense"
                  />
                </div>
                <div>
                  <button
                    className="btn btn-primary btn-lg btn-block"
                    onClick={e => this.handleNewExpenseSubmit(e)}
                  >
                    Submit
                  </button>
                </div>
                <div className="bes">
                  {this.state.isLoadingE && <span>Loading...</span>}
                  {this.state.expenses.map((expense,index) => (
                      <div className="be" key={expense.id}> <h4>
                        <h4 style={{textAlign: "left"}}>{expense.note_}</h4> {expense.float_}
                          
                          <img src={'https://img.icons8.com/office/16/000000/cancel.png'}
                          onClick={e=> this.handleDeleteExpense(index)}
                          style={{cursor: "pointer", paddingLeft: "1rem"}}/>
                          
                      </h4></div>
                    )
                  )}
                </div>

                <div className="total">

                </div>

              </div>

              

          </div>

          <div className="col-lg-6 graph">
                <LineChart width={650} height={500} data={data} margin={{ top: 5, right: 0, bottom: 5, left: 20 }}>
                <Line type="monotone" dataKey="budget" stroke="#8884d8" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Tooltip/>
                <Legend/>
                <XAxis dataKey="name" />
                <YAxis />
              </LineChart>
          </div>

        </div>

      </div> : null
    );
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
      username: loadUserData().username
    });
  }

  handleNewBudgetChange(event) {
    this.setState({newBudget: event.target.value})
  }
 
  handleNewBudgetSubmit(event) {
    this.saveNewBudget(this.state.newBudget)
    this.setState({
      newBudget: ""
    })
  }

  saveNewBudget(statusText) {
    let budgets = this.state.budgets
    
    var myArray = statusText.split(/([0-9]+)/)
    var note = myArray[0]
    var float = parseFloat(myArray[1]+myArray[2]+myArray[3])

    let budget = {
      id: this.state.statusIndex++,
      note_: note,
      float_: float,
      created_at: Date.now()
    }
 
    //localdata[3].budget = this.state.localdata[3].budget+budget.float_ //lol
    //budgettotal = budgettotal + float
    budgets.push(budget)
    const options = { encrypt: false }
    putFile('budgets.json', JSON.stringify(budgets), options)
      .then(() => {
        this.setState({
          budgets: budgets
        })
      })
  }


  handleNewExpenseChange(event) {
    this.setState({newExpense: event.target.value})
  }
 
  handleNewExpenseSubmit(event) {
    this.saveNewExpense(this.state.newExpense)
    this.setState({
      newExpense: ""
    })
  }

  saveNewExpense(statusText) {
    let expenses = this.state.expenses
    
    var myArray = statusText.split(/([0-9]+)/)
    var note = myArray[0]
    var float = parseFloat(myArray[1]+myArray[2]+myArray[3])

    let expense = {
      id: this.state.statusIndex++,
      note_: note,
      float_: float,
      created_at: Date.now()
    }
    //expensetotal = expensetotal + float
    expenses.push(expense)
    const options = { encrypt: false }
    putFile('expenses.json', JSON.stringify(expenses), options)
      .then(() => {
        this.setState({
          expenses: expenses
        })
      })
  }


  handleDeleteBudget(index) {
    let budgets = this.state.budgets
   // budgettotal = budgettotal - budgets[index].float_
    budgets.splice(index,1)
    
    const options = { encrypt: false }
    putFile('budgets.json', JSON.stringify(budgets), options)
      .then(() => {
        this.setState({
          budgets: budgets
        })
      })
  }

  handleDeleteExpense(index) {
    let expenses = this.state.expenses
   // expensetotal = expensetotal - expenses[index].float_
    expenses.splice(index,1)

    const options = { encrypt: false }
    putFile('expenses.json', JSON.stringify(expenses), options)
      .then(() => {
        this.setState({
          expenses: expenses
        })
      })
  }

  fetchData() {
    this.setState({ isLoadingE: true })
    const options = { decrypt: false }
    getFile('expenses.json', options)
      .then((file) => {
        var expenses = JSON.parse(file || '[]')
        this.setState({
          person: new Person(loadUserData().profile),
          username: loadUserData().username,
          expenseIndex: expenses.length,
          expenses: expenses,
        })
      })
      .finally(() => {
        this.setState({ isLoadingE: false })
      })


    this.setState({ isLoadingB: true })
    getFile('budgets.json', options)
      .then((file) => {
        var budgets = JSON.parse(file || '[]')
        this.setState({
          statusIndex: budgets.length,
          budgets: budgets,
        })
      })
      .finally(() => {
        this.setState({ isLoadingB: false })
      })
  }

  componentDidMount() {
    this.fetchData()
  }

  isLocal() {
    return this.props.match.params.username ? false : true
  }
}
