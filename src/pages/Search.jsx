import { Link } from 'react-router-dom'
import Slider from '../components/Slider'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

function Search() {
    const value="dadad"
    
    const onSubmit = async (e) => {
        e.preventDefault()
    }

  return (
    <div className='explore'>
      <header>
        <p className='pageHeader'>Search</p>
      </header>

      <main>
        <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type='email'
            className='searchInput'
            placeholder='Search'
            id='email'
            value={value}
            onChange={() => console.log("dadad")}
          />
          </form>
          </div>
      </main>
    </div>
  )
}

export default Search
