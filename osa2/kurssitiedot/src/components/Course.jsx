

  
  const Header = ({name}) => {
    return (
      <div>
        <h2>{name}</h2>
      </div>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <>
        {parts.map(part =>  
          <Part  key={part.id} part={part.name} exercises={part.exercises}/> )}
    
      </>
    )
  }
  
  
  const Part = ({part, exercises}) => {
      return(
        <p>{part} {exercises}</p>
      )
  }
  
  const Total = ({parts}) => {
    const total = parts.reduce((acc,part)=> acc+part.exercises, 0)
    return (
      <div>
        <b> total of {total} exercises </b>
      </div>
    )
  }

  const Course = ({course}) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
  }
  

  export default Course
