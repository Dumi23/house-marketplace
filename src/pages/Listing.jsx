import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { toast } from 'react-toastify'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import axios from 'axios'
import ListingItem from '../components/ListingItem'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Listing() {
  const [listing, setListing] = useState({})
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [modal, setModal] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  const toggleModal = () => {
    setModal(!modal)
  }

  useEffect(() => {
    const fetchLocale = async () => {
      await axios.get(`http://127.0.0.1:8000/club/locale/${params.listingId}`).then((response) => {setListing(response.data)}).catch((error) => toast.error("Something went wrong"))
      if (listing) {
        setLoading(false)
      }
    }
    fetchLocale()
  }, [navigate, params.listingSlug])


  if (loading) {
    return <Spinner />
  }

  return (
    <main>
      <Helmet>
        <title>{listing.name}</title>
      </Helmet>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          <SwiperSlide>
            <div
              style={{
                background: `url(http://127.0.0.1:8000${listing.image}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
              onClick={() => console.log("clicked")}
            ></div>
          </SwiperSlide>
      </Swiper>
      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            setShareLinkCopied(false)
          }, 2000)
        }}
      >
        <img src={shareIcon} alt='' />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name}
        </p>
        <p className='listingLocation'>{listing.street_name}</p>
        <p className='listingType'>
          {listing.type.name}
        </p>
        {listing.music.map((data) =>
          <p className='discountPrice'>
            {data.genre}
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
          </li>
          <li>
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>
        <div className='category'>
      <header>
        <p className='pageHeader'>Events</p>
      </header>

      {listing.events && listing.events.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listing.events.map((data) => (
                <ListingItem
                  listing={data}
                  id={data.slug}
                  key={data.slug}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
        </>
      ) : (
        <p>There are no events for this locale</p>
      )}
    </div>

        <p className='listingLocationTitle'>Location</p>

        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.latitude, listing.longitude]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[listing.latitude, listing.longitude]}
            >
              <Popup>{listing.street_name}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  )
}

export default Listing

// https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat
