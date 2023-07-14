import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import Spinner from '../components/Spinner'
import axios from 'axios'
import Select from 'react-select'

function CreateListing() {
  // eslint-disable-next-line
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState([])
  const [music, setMusic] = useState([])
  const [locationSelect, setLocationSelect] = useState()
  const [selectedMusic, setSelectedMusic] = useState([])
  const [savedLocale, setSavedLocale] = useState({})
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState([])
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    description: '',
    street_name: '',
    image: {},
    latitude: 0,
    longitude: 0,
    location_slug: '',
    slug_music: []
  })

  const {
    type,
    name,
    description,
    street_name,
    image,
    latitude,
    longitude,
    slug_music,
    location_slug,
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)


  const fetchMusic = async () => {
    await axios.get(`http://127.0.0.1:8000/club/music?search=${search}`).then((response) =>{setMusic(response.data.results)}).catch(error => console.log(error))
  }

  useEffect(() => {
      if (isMounted) {
        axios.get("http://127.0.0.1:8000/club/location").then((response) => setLocation(response.data.results)).catch(error => console.log(error))
        axios.get("http://127.0.0.1:8000/club/types").then((response) => setTypes(response.data.results)).catch(error => console.log(error))
        fetchMusic()
      }

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const selectStyle = {
    control: styles => ({...styles, boxShadow: 'rgba(0, 0, 0, 0.11)', border: "none", background: "#ffffff", borderRadius:"3rem",   height: "3rem",   width: "100%",  outline: "none",   fontFamily: "'Montserrat', sans-serif",   padding:"0 3rem", fontSize:"1rem"})
  }

  const handleChange = charEntered => {
    setSearch(charEntered);
    fetchMusic();
  };

  const handleLocationValueChange = (r) => {
    setFormData((prevState) => ({
      ...prevState,
      location_slug: r.slug
    }))
  }

  const handleValueChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      slug_music: Array.isArray(e) ? e.map(x => x.slug): []
    }))
  }



  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)


    if (image.length > 1) {
      setLoading(false)
      toast.error('Only one image can be uploaded (coming soon)')
      return
    }

    let geolocation = {}
    let locationResp

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${street_name}&key=AIzaSyBfd-WfPA5-DfRsJJ-Ct7GY55DOlg2iaw8`
      )

      const data = await response.json()
      
      console.log(data.results[0]?.geometry.location.lat ?? 0)
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0

      locationResp =
        data.status === 'ZERO_RESULTS'
          ? undefined
          : data.results[0]?.formatted_address

      if (locationResp === undefined || locationResp.includes('undefined')) {
        setLoading(false)
        toast.error('Please enter a correct address')
        return
      }
    } else {
      setFormData((prevState) => ({...prevState, latitude: geolocation.lat}))
      setFormData((prevState) => ({...prevState, latitude: geolocation.lng}))
    }

    // Send a post for create
    axios.post('http://127.0.0.1:8000/club/locale/create', formData, {
    headers: {'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'multipart/form-data'}}
    ).then((response) => navigate(`/category/${response.data['type']['name']}/${response.data['slug']}`)).catch(error => console.log(error))

    setLoading(false)
    toast.success('Locale created')
  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files,
      }))
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  if (loading) {
    return <Spinner />
  }
  console.log(formData)
  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Create a Locale</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Locale Type</label>
          {types.map((data) =>
          <div className='formButtons'>
            <button
              type='button'
              className={type === data.slug ? 'formButtonActive' : 'formButton'}
              id='type'
              value={data.slug}
              onClick={onMutate}
            >
              {data.name}
            </button>
          </div>
          )}

          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />

          <label className='formLabel'>Description</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='description'
            value={description}
            onChange={onMutate}
            required
          />

            <label className='formLabel'> Music </label>
            <Select
              styles={selectStyle}
              isMulti
              defaultInputValue=''
              onChange={handleValueChange}
              className="selectMusic"
              onInputChange={handleChange}
              options={music}
              getOptionLabel={(music) => music['genre']}
              getOptionValue ={(music) => music['slug']}
            />

          <label className='formLabel'> Location
            <Select
              styles={selectStyle}
              defaultInputValue=''
              onChange={handleLocationValueChange}
              className="selectMusic"
              options={location}
              getOptionLabel={(location) => location['name']}
              getOptionValue ={(location) => location['slug']}
            />
          </label>  

          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='street_name'
            value={street_name}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 1).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='image'
            onChange={onMutate}
            max='1'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Locale
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateListing
