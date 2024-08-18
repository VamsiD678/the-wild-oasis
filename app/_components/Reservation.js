import DateSelector from "@/starter/components/DateSelector"
import ReservationForm from "@/starter/components/ReservationForm"
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service"
import { auth } from "../_lib/auth"
import LoginMessage from "@/starter/components/LoginMessage"

export default async function Reservation({cabin}) {
  //  Executing promise parallelly all at time
  const [settings,bookedDates] = await Promise.all([getSettings(),getBookedDatesByCabinId(cabin.id)])

  const session = await auth() 
  
  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector settings={settings} cabin={cabin} bookedDates={bookedDates}/>
      {
        session?.user ? <ReservationForm cabin={cabin} user={session.user} /> : <LoginMessage/>
      }
    </div>
  )
}