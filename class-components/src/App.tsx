import React from 'react'
import * as ReactDomClient from 'react-dom/client'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

class Header extends React.Component {
  constructor(props){
    super(props)
    this.state ={
      randomPokemon: "",
      query: "",
      answer: ""
    }

    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getRandomPokemon();
  }

  random = Math.floor(Math.random() * (898 - 1 + 1)) + 1;


  getRandomPokemon() {
    fetch(`https://pokebuildapi.fr/api/v1/pokemon/${this.random}`)
        .then(function(response) {
            return response.json();
        })
        .then(result => {
          this.setState({ randomPokemon: result})
      });
  }

  getPokemonById(id) {
    fetch(`https://pokebuildapi.fr/api/v1/pokemon/${id}`)
        .then(function(response) {
            return response.json();
        })
        .then(result => {
          this.setState({ answer: result})
      });
  }

  handleChange(event) {
    this.setState({ query: event.target.value }, () => {
      this.search();
    });
  }

  search(){
    const query = this.state.query.trim();
    if(query.length){
      const regex = /\d/g;
      if(query.length === query.replace(regex, query).length){
        if(Number(query) > 0 && Number(query) < 899)
          this.getPokemonById(Number(query));
          this.props.onHeaderClick(this.state.answer);
      }
    }
    
  }
  render() {
      return (
        <header className="header">
        <h1 className="header__head">Ваш случайный покемон:</h1>
        <div className="header__random-pokemon unvisible">
          <div className="header__image">
            <img className = "header__pic" src = {(this.state.randomPokemon)?String(this.state.randomPokemon.image):""} />
          </div>
          <div className="header__name">
          {String(this.state.randomPokemon)?String(this.state.randomPokemon.name):""}
          </div>
        </div>

        <div className="header__inctruction">
          <div className="header__full header__block">
            <div className="header__image-full"></div>
            <div className="header__text-instruct"> Оставьте поискововую строку пустой, чтобы получить всех покемонов </div>
          </div>
          <div className="header__id header__block">
            <div className="header__image-id"></div>
            <div className="header__text-instruct">Напишите номер покемона, чтобы получить информацию о нем</div>
          </div>
          <div className="header__type header__block">
            <div className="header__image-type"></div>
            <div className="header__text-instruct">Напишите <span title="Bug, dark, dragon, electic, fairy, fighting, fire, flying, ghost, grass, ground, ice, normal, poison, psychic, rock, steel, water">тип</span> покемона, если хотите посмотреть покемонов с двумя конкретными типами, то напишите их через пробел</div>
            </div>
          <div className="header__generation header__block">
            <div className="header__image-gen"></div>
            <div className="header__text-instruct">Чтобы посмотреть определенное поколение покемонов, напишите запрос в формате genНомер</div>
            </div>
        </div>

        <div className="header__form">
          <input type="text" className="header__search" onChange={this.handleChange}/>
          <button className="header__button"  onClick = {this.search}></button>
        </div>
        <div className="header__guide guide">
        </div>
      </header>
      )
  }
}

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data,
    }
  }



  render(): React.ReactNode {
    console.log(this.props.data.name)
    return(
    <main className="result__box">
      <div className="result__left">
        <img className="result__image" src = {this.props.data.sprite}></img>
      </div>
      <div className="result__right">
        <div className="result__name">{this.props.data.name}</div>
        <ul>
          {
            this.props.data.apiTypes && this.props.data.apiTypes.length ? (
            this.props.data.apiTypes.map(item => (
              <li key={item.name}>{item.name}</li>
            ))
            ):("")
          }
        </ul>

      </div>
    </main>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: ""
    }
  }
  
  handleHeaderClick = (newData) => {
    this.setState({ 
      data: newData
    });
  };

  render(){
    return (
      <>
        <Header onHeaderClick={this.handleHeaderClick} />
        <Main data={this.state.data} type={this.state.type} />
      </>
    )
    }
}

export default App
