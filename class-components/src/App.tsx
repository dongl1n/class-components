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
    }
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
  render() {
    this.getRandomPokemon();
    console.log(String(this.state.randomPokemon.name))
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

        <form action="" className="header__form">
          <input type="text" className="header__search"/>
          <button className="header__button"></button>
        </form>
        <div className="header__guide guide">
        </div>
      </header>
      )
  }
}

class App extends React.Component {
  render(){
    return (
      <>
        <Header />
      </>
    )
    }
}

export default App
