import Autocomplete from '../Autocomplete/AutocompleteFunc'
import { CustomFetch } from '../../mock'
import './App.css'

const getOptions = (query) => {
  return CustomFetch(query.toLowerCase())
}

const handleChange = (option) => {
  console.log('change option', option)
}

const App = () => {
  return (
    <Autocomplete
      getOptions={getOptions}
      label="Select country"
      onChange={handleChange}
    />
  )
}

export default App
