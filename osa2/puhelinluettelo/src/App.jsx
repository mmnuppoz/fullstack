import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Numbers from './components/Numbers'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const exsistingPerson = persons.find((person)=> person.name === newName)
    if(exsistingPerson){
      const confirmed = window.confirm(`${newName} is already added to phonebook, replace the old nuber with a new one?`)
      if (confirmed){
        const updatedPerson = {...exsistingPerson, number: newNumber};
        personService
        .update(exsistingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons((persons)=>
          persons.map((p)=> (p.id !== exsistingPerson.id ? p: returnedPerson)))
        })
      }
    }

    else{
      const personObject = {
        name: newName,
        number: newNumber
      }

      personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const deletePersonFromList = async(id)=> {
    const person = persons.find(p => p.id === id)
    const confirmed = window.confirm(`Delete ${person.name}?`)
    console.log(person)
    if (confirmed){
      personService
      .deletePerson(person.id)
      setPersons(persons.filter(person=> person.id !== id))
    }
  }


  const handleNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleFilter=(event)=>{
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div><Filter filter={filter} handleFilter={handleFilter}/></div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
      <div> 
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div> 
        number: <input value={newNumber} onChange={handleNumber}/>
      </div>        
        <div>
          <button type="submit">add</button>
        </div>
      
      </form>   
      <h2>Numbers</h2>
      <ul>
        <Numbers persons={persons} filter={filter} handleNumber={handleNumber} 
        deletePerson={deletePersonFromList}/>
      </ul>
    </div>
  )


}

export default App
