const Header = (props) => {
  return (
    <div>
      <p>{props.course}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part={props.part} />
    </div>
  )
}

const Part = (props) => {
    return(
      <p>{props.part.name} {props.part.exercises}</p>
    )
}

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.total1+props.total2+props.total3}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content part={part1}/>
      <Content part={part2}/>
      <Content part={part3}/>
      <Total total1={part1.exercises} total2={part2.exercises} total3={part3.exercises}/>
    </div>
  )
}

export default App
