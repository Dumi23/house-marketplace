import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import OAuth from '../components/OAuth'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import axios from 'axios'
import Select from 'react-select'



function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [music, setMusic] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [typeOf, setTypeOf] = useState()
  const [formData, setFormData] = useState({
    type: 2,
    username: '',
    email: '',
    password: '',
    music_slug: [],
  })


  const fetchMusic = async () => {
    await axios.get(`http://127.0.0.1:8000/club/music?search=${search}`).then((response) =>{setMusic(response.data.results)}).catch(error => setError(error))
  }
  
  useEffect(() => fetchMusic(), [])

  const selectStyle = {
    control: styles => ({...styles, boxShadow: 'rgba(0, 0, 0, 0.11)', border: "none", background: "#ffffff", borderRadius:"3rem",   height: "3rem",   width: "100%",  outline: "none",   fontFamily: "'Montserrat', sans-serif",   padding:"0 3rem", fontSize:"1rem"})
  }

  console.log(music)

  const {type, username, email, password, music_slug} = formData

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  const handleValueChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      slug_music: Array.isArray(e) ? e.map(x => x.slug): []
    }))
  }

  console.log(type)

  const navigate = useNavigate()

  const handleChange = charEntered => {
    setSearch(charEntered);
    fetchMusic();
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      return axios.post('http://127.0.0.1:8000/api/register', formData).then((response) =>{toast.success(response.data['message'])}).catch((error) => {toast.error("Something went wrong during registration")})

    } catch (error) {
      toast.error('Something went wrong with registration')
    }
  }

  console.log(search)

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type='text'
            className='nameInput'
            placeholder='Name'
            id='username'
            value={username}
            onChange={onChange}
          />
          <input
            type='email'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt='show password'
              className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
            <div className='formButtons' style={{marginBottom:"10px", marginTop:"-25px"}}>
              <button
                type='button'
                className={type == 0 ? 'formButtonActive' : 'formButton'}
                id='type'
                value={0}
                onClick={onMutate}
              >
                USER
              </button>
              <button
                type='button'
                className={type == 1 ? 'formButtonActive' : 'formButton'}
                id='type'
                value={1}
                onClick={onMutate}
              >
                OWNER
              </button>
            </div>

          <div>
            <Select
              styles={selectStyle}
              isMulti
              onChange={handleValueChange}
              defaultInputValue=''
              className="selectMusic"
              onInputChange={handleChange}
              options={music}
              getOptionLabel={(music) => music['genre']}
              getOptionValue ={(music) => music['slug']}
            />
            </div>
          </div>



          <div className='signUpBar'>
            <p className='signUpText'>Sign Up</p>
            <button className='signUpButton'>
              <ArrowRightIcon fil l='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        <Link to='/sign-in' className='registerLink'>
          Sign In Instead
        </Link>
      </div>
    </>
  )
}

export default SignUp
