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
    type: 1,
    name: '',
    email: '',
    password: '',
    music: music,
  })


  const fetchMusic = async () => {
    await axios.get(`http://127.0.0.1:8000/club/music?search=${search}`).then((response) =>{setMusic(response.data.results)}).catch(error => setError(error))
  }
  
  useEffect(() => fetchMusic(), [])

  const selectStyle = {
    control: styles => ({...styles, boxShadow: 'rgba(0, 0, 0, 0.11)', border: "none", background: "#ffffff", borderRadius:"3rem",   height: "3rem",   width: "100%",  outline: "none",   fontFamily: "'Montserrat', sans-serif",   padding:"0 3rem", fontSize:"1rem"})
  }

  console.log(music)

  const { name, email, password } = formData

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }
  }


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
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = { ...formData }
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')
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
            id='name'
            value={name}
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
                className={typeOf === 0 ? 'formButtonActive' : 'formButton'}
                id='type'
                value={0}
                onClick={onMutate}
              >
                USER
              </button>
              <button
                type='button'
                className={typeOf === 1 ? 'formButtonActive' : 'formButton'}
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
              defaultInputValue=''
              className="selectMusic"
              onInputChange={handleChange}
              options={music}
              getOptionLabel={(music) => music['genre']}
              getOptionValue ={(music) => music['slug']}
            />
            </div>
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          </Link>


          <div className='signUpBar'>
            <p className='signUpText'>Sign Up</p>
            <button className='signUpButton'>
              <ArrowRightIcon fil l='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        <OAuth />

        <Link to='/sign-in' className='registerLink'>
          Sign In Instead
        </Link>
      </div>
    </>
  )
}

export default SignUp
