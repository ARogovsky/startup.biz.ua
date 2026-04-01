import Link from 'next/link'
import Image from 'next/image'
import { GoLocation } from "react-icons/go"

interface VacanciesCardProps {
  vacancy: string;
  type: string;
  salary: string | number | number[]; // Depending on usage
  company: string;
  location: string;
  logo: string;
  slug: string;
}

const VacanciesCard = ({ vacancy, type, salary, company, location, logo, slug }: VacanciesCardProps) => {

  return (
    <div className="card p-x-24 p-y-24">
      <h5 className="m-y-0 fw-600"><Link href={`/vacancies/${slug}`}>{vacancy}</Link></h5>
      <div className="flex aic m-y-8">
        <span className="p-x-6 p-t-2 p-b-1 bg-hero r-4 m-r-8 c-blue upp title">{type}</span><span>Умови: {salary}</span>
      </div>
      <div className="flex aic h-p-64">
        <div className="bc-light bw-2 r-8 flex aic jcc w-p-48 h-p-48 c-white">
          <Image src={`/logos/${logo}.png`} alt={company} width={24} height={24} style={{ objectFit: 'contain' }} />
        </div>
        <div className="p-l-16 h-p-40">
          <h6 className="m-y-0 fw-600">{company}</h6>
          <div className="flex aic"><GoLocation size={15} className="c-medium" /><span className="p-l-5">{location}</span></div>
        </div>
      </div>
    </div>
  )

}

export { VacanciesCard }