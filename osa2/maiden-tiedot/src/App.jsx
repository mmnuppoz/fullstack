import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"
import Filter from "./components/filterCountries"
import DisplayCountry from "./components/displayCountry";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filterCountries, setCountryFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null); 

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        console.log("fetching data");
        setCountries(response.data);
      });
  }, []);
  
  console.log("render", countries.length, "countries");

  const filteredCountries = countries.filter((country) => {
    if (country.name.common !== undefined) {
      return country.name.common
        .toLowerCase()
        .includes(filterCountries);
    }
    return false;
  });

  const handleShowClick = (country) => {
    setSelectedCountry(country);
  };

  const handleFilterChange = (event) => {
    setCountryFilter(event.target.value.toLowerCase());
    setSelectedCountry(null); 
  };

  return (
    <>
      <div>
        <Filter value={filterCountries} onChange={handleFilterChange} />
        {selectedCountry ? (
          <DisplayCountry country={selectedCountry} /> 
        ) : (
          <>
            {filteredCountries.length === 1 ? (
              <DisplayCountry country={filteredCountries[0]} />
            ) : filteredCountries.length <= 10 ? (
              filteredCountries.map((country) => (
                <div key={country.name.common}>
                  {country.name.common}
                  <button onClick={() => handleShowClick(country)}>show</button>
                </div>
              ))
            ) : (
              <div>Too many matches, specify more</div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default App;
