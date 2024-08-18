'use client'

import { useReservation } from "@/app/_components/ReservationContext";
import SubmitButton from "@/app/_components/SubmitButton";
import { createBooking } from "@/app/_lib/action";
import { differenceInDays } from "date-fns";

function ReservationForm({cabin,user}) {
 
  const { range, resetRange } = useReservation()

  const { regularPrice, discount, maxCapacity, name, description, id } = cabin
  console.log(cabin);

  const startDate = range?.from 
  const endDate = range?.to 
  const numNights = Number(differenceInDays(range?.to,range?.from)) + 1
  const cabinPrice = numNights * (regularPrice-discount)
  
  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId:id
  }

  const createBookingwithData = createBooking.bind(null,bookingData)

  return (
    <div className='scale-[1.01]'>
      <div className='bg-primary-800 text-primary-300 flex justify-between items-center px-12'>
        <p className="text-xl py-3 px-4 bg-purple-500" >Logged in as</p>

        <div className='flex gap-4 items-center px-6'>
          <img
            // Important to display google profile images
            referrerPolicy='no-referrer'
            className='h-8 rounded-full'
            src={user?.image}
            alt={user?.name}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form 
        // action={createBookingwithData} 
        action={async (formData)=> {
          await createBookingwithData(formData);
          resetRange();
        }} 
        className='bg-primary-900 py-5 px-8 text-lg flex gap-5 flex-col'>

        <div className='mb-7'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            name='numGuests'
            id='numGuests'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            required
          >
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          { !(startDate && endDate) ? 
            <p className='text-primary-300 text-base py-4'>Start by selecting dates</p> :
            <SubmitButton pendingLabel='Reserving..'>Reserve now</SubmitButton>
          }
        
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
