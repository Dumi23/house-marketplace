import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import axios from 'axios'
import { useState, useEffect } from 'react'

function ListingItem({ listing, id, onEdit, onDelete }) {
  function imageHandler(){
    if (listing.image == null){
      return 'https://www.jennybeaumont.com/wp-content/uploads/2015/03/placeholder-800x423.gif'
    }
    return "http://127.0.0.1:8000"+ listing.image
  }
  return (
    <li className='categoryListing'>
      <Link
        to={`/locale/${listing.slug}`}
        className='categoryListingLink'
      >
        <img
          src={imageHandler()}
          alt={listing.name}
          className='categoryListingImg'
        />
        <div className='categoryListingDetails'>
          <p className='categoryListingName'>{listing.name}</p>
          
          <p className='categoryListingPrice'>
            {listing.start_time}
          </p>
          <div className='categoryListingInfoDiv'>
            <p className='categoryListingInfoText'>
              {listing.description}
            </p>
            <p className='categoryListingInfoText'>
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <DeleteIcon
          className='removeIcon'
          fill='rgb(231, 76,60)'
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}

    </li>
  )
}

export default ListingItem