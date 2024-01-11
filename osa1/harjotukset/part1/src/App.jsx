const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born {bornYear()}</p>
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