import { Link, useNavigate, useRoutes, useLocation } from 'react-router-dom'
import Slider from '../components/Slider'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ListingItem from '../components/ListingItem'


function Explore() {
  const [locales, setLocales] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUserFeed = async () => {
    if(localStorage.getItem("token") === null){
      await axios.get(`http://127.0.0.1:8000/club/feed`).then((response) =>{setLocales(response.data.results)}).catch(error => console.log(error))  
    }
    await axios.get(`http://127.0.0.1:8000/club/feed`,{headers: {'Authorization': "Bearer " + localStorage.getItem('token')}}).then((response) =>{setLocales(response.data.results)}).catch(error => console.log(error))
  }

  useEffect(() => {
    fetchUserFeed()
    setLoading(false)
  }, [])
  console.log(locales)
  return (
    <div className='explore'>
      <header>
        <p className='pageHeader'>Explore</p>
      </header>

      <main>
        <Slider />

        <p className='exploreCategoryHeading'>Locales For You</p>
        {locales?.length > 0 && (
          <>
            <ul className='listingsList' style={{paddingLeft: "0px"}}>
              {locales.map((locale) => (
                <ListingItem
                  key={locale.slug}
                  listing={locale}
                  id={locale.slug}
                  onEdit={() => {console.log(locale)}}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Explore
