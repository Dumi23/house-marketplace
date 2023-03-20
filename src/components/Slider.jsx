import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import Spinner from './Spinner'
import axios from 'axios'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Slider() {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState([])

  const navigate = useNavigate()

  const fetchUserFeed = async () => {
    await axios.get(`http://127.0.0.1:8000/club/feed`,{headers: {'Authorization': "Bearer " + localStorage.getItem('token')}}).then((response) =>{setListings(response.data.results)}).catch(error => console.log(error))
  }

  console.log(listings)

  useEffect(() => {
    fetchUserFeed()
    setLoading(false)
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings.length === 0) {
    return <></>
  }

  return (
    listings && (
      <>
        <p className='exploreHeading'>Recommended</p>

        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listings.map((data) => (
            <SwiperSlide
              key={data.name}
              onClick={() => navigate(`/category/${data.type}/${data.name}`)}
            >
              <div
                style={{
                  background: `url(http://127.0.0.1:8000${data.image}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='swiperSlideDiv'
              >
                <p className='swiperSlideText'>{data.address.street_name}</p>
                <p className='swiperSlidePrice'>
                  {data.type.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider
