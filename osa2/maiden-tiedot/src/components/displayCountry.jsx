const DisplayCountry = ({country, countryDelete}) => {

    return(
        <div>
            <h1>{country.name.common}</h1>
            <p>capital: {country.capital}</p>
            <p>area: {country.area}</p>
            <p>languages: </p>
            <ul>
                {Object.values(country.languages).map((language, index) => (
                    <li key={index}>
                        {language}
                    </li>
                ))}
            </ul>
            <p>{country.flag}</p>
        </div>
    )
}

export default DisplayCountry