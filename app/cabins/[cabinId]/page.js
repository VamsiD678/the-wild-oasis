import Reservation from "@/app/_components/Reservation";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import Cabin from "@/app/_components/Cabin";
import { Suspense } from "react";
import Loading from "../loading";


export async function generateMetadata({params}) {
  const { name } = await getCabin(params.cabinId)
  return {
    title:`Cabin ${name}`
  }
}

export async function generateStaticParams() {
  const cabins = await getCabins()
  const ids = cabins.map(cabin=> ({cabinId: String(cabin.id)}))
  console.log(ids);
  return ids
}

export default async function Page({params}) {

   const cabin = await getCabin(params.cabinId)

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin}/>
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve today. Pay on arrival.
        </h2>

        <Suspense fallback={<Loading/>} key={cabin.id}>
          <Reservation cabin={cabin} />
        </Suspense>
        
      </div>
    </div>
  );
}
