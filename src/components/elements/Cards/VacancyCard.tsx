import Link from 'next/link'
import Image from 'next/image'
import { GoLocation } from "react-icons/go"

interface VacancyCardProps {
  vacancy: string;
  type: string;
  salary: number[] | string;
  company: string;
  location: string[] | string;
  logo: string;
  slug?: string;
}

const VacancyCard = ({ vacancy, type, salary, company, location, logo, slug }: VacancyCardProps) => {
  // Helper to format salary
  const formatSalary = (sal: number[] | string) => {
    if (Array.isArray(sal)) {
      return `$${sal[0]}K - $${sal[1]}K`;
    }
    return sal;
  };

  // Helper to format location
  const formatLocation = (loc: string[] | string) => {
    if (Array.isArray(loc)) {
      return `${loc[0]}, ${loc[1]}`;
    }
    return loc;
  };

  return (
    <div className="card p-x-24 p-y-24" style={{ border: 'none' }}>
      <h5 className="m-y-0 fw-600">
        {slug ? <Link href={`/vacancies/${slug}`} className="c-black">{vacancy}</Link> : vacancy}
      </h5>
      <div className="flex aic m-y-8">
        <span className="p-x-6 p-t-2 p-b-1 bg-hero r-4 m-r-8 c-blue upp title">{type}</span>
        <span>Умови: {formatSalary(salary)}</span>
      </div>
      <div className="flex aic h-p-64">
        <div className="bc-light bw-2 r-8 flex aic jcc w-p-48 h-p-48 c-white">
          <Image src={`/logos/${logo}.png`} alt={company} width={24} height={24} style={{ objectFit: 'contain' }} />
        </div>
        <div className="p-l-16 h-p-40">
          <h6 className="m-y-0 fw-600">{company}</h6>
          <div className="flex aic">
            <GoLocation size={15} className="c-medium" />
            <span className="p-l-5">{formatLocation(location)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { VacancyCard }