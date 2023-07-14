import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import EventItem from '../components/EventItem'
import axios from 'axios'


function Offers() {
  const [events, setEvents] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const fetchUserFeed = async () => {
    if(localStorage.getItem("token") === null){
      await axios.get(`http://127.0.0.1:8000/club/events`).then((response) =>{setEvents(response.data.results)}).catch(error => console.log(error))  
    }
    await axios.get(`http://127.0.0.1:8000/club/events`,{headers: {'Authorization': "Bearer " + localStorage.getItem('token')}}).then((response) =>{setEvents(response.data.results)}).catch(error => console.log(error))
  }


  useEffect(() => {
    fetchUserFeed()
    setLoading(false)
  }, [])

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Events</p>
      </header>

      {loading ? (
        <Spinner />
      ) : events && events.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {events.map((event) => (
                <EventItem
                  listing={event}
                  id={event.id}
                  key={event.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  )
}

export default Offers
