const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name} olet {props.age} vuotta!</p>
    </div>
  )
}

const Moi = ()=> {
  return(
    <div>
      <p>moimoimoi</p>
    </div>
  )
}

const App = () => {
  const nimi = 'Pekka'
  const ika = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="minea" age={12+1}/>
      <Moi />
      <Hello name={nimi} age={ika}/>
    </div>
  )
}

export default App