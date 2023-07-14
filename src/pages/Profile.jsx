import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth'
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import dring from '../assets/svg/dring.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import axios from 'axios'
import ListingItemUser from '../components/ListingItemUser'

function Profile() {
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState([])
  const [locales, setLocales] = useState([])
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: "Placeholder",
    email: "Placeholder",
  })

  const { name, email } = formData

  const navigate = useNavigate()
  const isMounted = useRef(true)
  const fetchUser = async () => {
    await axios.get('http://127.0.0.1:8000/api/me',{
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('token')
      }
    }).then((response) => {setUser(response.data.user_data); setLocales(response.data.results)}).catch((error) => {if (error.response.status != 200){
      localStorage.clear('token')
      navigate('/sign-in')
    }})
  }

  console.log(locales)

  useEffect(() => {
    if(isMounted){
      fetchUser()
    }
    return () => {
      isMounted.current = false
    }
  }, [])


  const onLogout = () => {
    localStorage.clear('token')
    navigate('/')
  }

  /*const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      console.log(error)
      toast.error('Could not update profile details')
    }
  }*/

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      )
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  const onEdit = (listingSlug) => navigate(`/edit-listing/${listingSlug}`)

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button type='button' className='logOut' onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && //onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={user['username']}
              onChange={onChange}
            />
            <input
              type='email'
              id='email'
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={user['email']}
              onChange={onChange}
            />
          </form>
        </div>

      {!user['type'] == 0 &&
        <Link to='/create-listing' className='createListing'>
          <img src={dring} alt='home' />
          <p>Create Your Locale</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>
      }

        {locales?.length > 0 && (
          <>
            <p className='listingText' >Your Locales</p>
            <ul className='listingsList' style={{paddingLeft: "0px"}}>
              {locales.map((locale) => (
                <ListingItemUser
                  key={locale.slug}
                  listing={locale}
                  id={locale.slug}
                  onDelete={() => onDelete(locale.slug)}
                  onEdit={() => onEdit(locale.slug)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile
