"use server"
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth()
  if(!session.user) throw new Error('You must logged in')

  const [nationality, countryFlag] = formData.get('nationality').split('%')
  const nationalID = formData.get('nationalID')
  
  // if(!/^[a-zA-Z0-9]{6-12}$/.test(nationalID)) throw new Error('Please provide valid nationalID')
  
  const updateData = { nationalID, nationality, countryFlag }
  // console.log(updateData);

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)

  if (error) {
    console.error(error.message);
    throw new Error('Guest could not be updated');
  }

  revalidatePath('/account/profile')

}

export async function deleteReservation(bookingId) {
  const session = await auth()
  if(!session.user) throw new Error('You must logged in')

  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingsIds = guestBookings.map(booking=> booking.id)

  if(!guestBookingsIds.includes(bookingId)) 
  throw new Error('You are not allowed to delete this booking ')

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
  if (error) throw new Error('Booking could not be deleted');

  revalidatePath('/account/reservations')
}

export async function updateReservation(formData) {
  
  // 01. Authentication
  const session = await auth()
  if(!session.user) throw new Error('You must logged in')
    
  const bookingId = +formData.get('bookingId')
  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingsIds = guestBookings.map(booking=> booking.id)

  // 02. Authorization
  if(!guestBookingsIds.includes(bookingId)) 
  throw new Error('You are not allowed to update this booking ')
    
  const numGuests = Number(formData.get('numGuests'))
  const observations = formData.get('observations')

  // 03. Building Update data
  const updateData = {numGuests, observations}

  // 04. Mutation
  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .select()
    .single();

  // 05. Error Handling
  if (error){
    throw new Error('Booking could not be updated');
  }

  // 06. Revalidation
  revalidatePath(`/account/reservations`)
  revalidatePath(`/account/reservations/edit/${bookingId}`)
  
  // 07. Redirecting
  redirect(`/account/reservations`)
}

export async function createBooking(bookingData,formData) {
  const session = await auth()
  if(!session.user) throw new Error('You must logged in')

  const allBookingData = {...bookingData, 
    guestId: session.user.guestId,
    numGuests:+formData.get('numGuests'),
    observations:formData.get('observations'),
    extraPrice:0,
    totalPrice: bookingData.cabinPrice,
    isPaid:false,
    hasBreakfast:false,
    status:'unconfirmed'
  }

  const { error } = await supabase
    .from('bookings')
    .insert([allBookingData])

  if (error){
    console.error(error.message);
    throw new Error('Booking could not be created'); 
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`)

  redirect('/cabins/thankyou')
}

export async function signInAction() {
  await signIn('google',{redirectTo:'/account'})
}

export async function signOutAction() {
  await signOut({redirectTo:'/'})
}