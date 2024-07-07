import React from "react"
import "./App.css"

class ErrorBoundary extends React.Component<
  React.Props,
  { hasError: boolean }
> {
  constructor(props: React.Props): void {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): boolean {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, info)
  }

  render(): void {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>
    }

    return this.props.children
  }
}

interface Pokemon {
  image?: string
  name?: string
  sprite?: string
  apiTypes?: { name: string; image: string }[]
}

class Header extends React.Component<
  HeaderProps,
  {
    randomPokemon: Pokemon | null
    query: string
    answer: Pokemon | Pokemon[] | string | null
  }
> {
  constructor(props) {
    super(props)
    this.state = {
      randomPokemon: "",
      query: localStorage.getItem("searchQuery") || "",
      answer: "",
    }

    this.search = this.search.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.click = this.click.bind(this)
  }

  componentDidMount(): void {
    this.getRandomPokemon()
  }

  random = Math.floor(Math.random() * (898 - 1 + 1)) + 1

  getRandomPokemon(): void {
    fetch(`https://pokebuildapi.fr/api/v1/pokemon/${this.random}`)
      .then(function (response) {
        return response.json()
      })
      .then((result) => {
        this.setState({ randomPokemon: result })
      })
  }

  getPokemonById(id: number): void {
    fetch(`https://pokebuildapi.fr/api/v1/pokemon/${id}`)
      .then(function (response) {
        return response.json()
      })
      .then((result) => {
        this.setState({ answer: result })
        this.props.onHeaderClick(result)
      })
  }

  getPokemons(): void {
    fetch(`https://pokebuildapi.fr/api/v1/pokemon`)
      .then(function (response) {
        return response.json()
      })
      .then((result) => {
        this.setState({ answer: result })
        this.props.onHeaderClick(result)
      })
  }

  handleChange(event: Event): void {
    localStorage.setItem("searchQuery", event.target.value)
    this.setState({ query: event.target.value })
  }

  search(): void {
    const query: string = this.state.query.trim()
    if (query.length) {
      const regex: RegExp = /\d{1,}/g
      if (query.length === query.replace(regex, query).length) {
        if (Number(query) > 0 && Number(query) < 899)
          this.getPokemonById(Number(query))
        this.props.onHeaderClick(this.state.answer)
      }
    } else {
      this.getPokemons()
      this.props.onHeaderClick(this.state.answer)
    }
  }

  click(): void {
    this.setState({ button: "click" })
  }
  render(): void {
    return (
      <header className="header">
        <h1 className="header__head">Ваш случайный покемон:</h1>
        <div className="header__random-pokemon unvisible">
          <div className="header__image">
            <img
              className="header__pic"
              src={
                this.state.randomPokemon
                  ? String(this.state.randomPokemon.image)
                  : ""
              }
            />
          </div>
          <div className="header__name">
            {String(this.state.randomPokemon)
              ? String(this.state.randomPokemon.name)
              : ""}
          </div>
        </div>

        <div className="header__inctruction">
          <div className="header__full header__block">
            <div className="header__image-full"></div>
            <div className="header__text-instruct">
              {" "}
              Оставьте поискововую строку пустой, чтобы получить всех покемонов{" "}
            </div>
          </div>
          <div className="header__id header__block">
            <div className="header__image-id"></div>
            <div className="header__text-instruct">
              Напишите номер покемона, чтобы получить информацию о нем
            </div>
          </div>
          <div className="header__type header__block">
            <div className="header__image-type"></div>
            <div className="header__text-instruct">
              Напишите{" "}
              <span title="Bug, dark, dragon, electic, fairy, fighting, fire, flying, ghost, grass, ground, ice, normal, poison, psychic, rock, steel, water">
                тип
              </span>{" "}
              покемона, если хотите посмотреть покемонов с двумя конкретными
              типами, то напишите их через пробел
            </div>
          </div>
          <div className="header__generation header__block">
            <div className="header__image-gen"></div>
            <div className="header__text-instruct">
              Чтобы посмотреть определенное поколение покемонов, напишите запрос
              в формате genНомер
            </div>
          </div>
        </div>

        <div className="header__form">
          <input
            type="text"
            className="header__search"
            onChange={this.handleChange}
            value={this.state.query}
          />
          <button className="header__button" onClick={this.search}></button>
        </div>
        <div className="header__guide guide"></div>
      </header>
    )
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
    }
  }

  render(): React.ReactNode {
    return (
      <main className="result__box">
        {this.props.isLoading && <div className="loading"></div>}
        {!this.props.isLoading && !this.props.data.length && (
          <div className="result__card visible">
            <div className="result__left">
              <img className="result__image" src={this.props.data.sprite}></img>
            </div>
            <div className="result__right">
              <div className="result__name">{this.props.data.name}</div>
              <ul className="result__type">
                {this.props.data.apiTypes && this.props.data.apiTypes.length
                  ? this.props.data.apiTypes.map((item) => (
                      <li className="result__item" key={item.name}>
                        <img className="result__type-img" src={item.image} />
                        {item.name}
                      </li>
                    ))
                  : ""}
              </ul>
            </div>
          </div>
        )}
        {!this.props.isLoading && this.props.data === "No data" && (
          <div className="result__card"></div>
        )}
      </main>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: "No data",
      isLoading: false,
    }
  }

  handleHeaderClick = (newData): void => {
    this.setState({ isLoading: true }, () => {
      this.setState({ data: newData, isLoading: false })
    })
  }

  render(): void {
    return (
      <>
        <ErrorBoundary>
          <Header onHeaderClick={this.handleHeaderClick} />
          <Main data={this.state.data} isLoading={this.state.isLoading} />
        </ErrorBoundary>
      </>
    )
  }
}

export default App
