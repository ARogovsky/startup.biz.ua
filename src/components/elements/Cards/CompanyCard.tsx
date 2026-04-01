import Image from 'next/image'
import { GoLocation } from "react-icons/go"

interface CompanyCardProps {
  company: string;
  city: string;
  country: string;
  logo: string;
  vacancies?: number;
}

const CompanyCard = ({ company, city, country, logo }: CompanyCardProps) => {

  return (
    <div className="card p-x-24 p-y-24">
      <div className="flex aic h-p-64 m-b-16">
        <div className="bc-light bw-2 r-8 flex aic jcc w-p-48 h-p-48">
          <Image src={`/logos/${logo}.png`} alt={company} width={24} height={24} />
        </div>
        <div className="p-l-16 h-p-40">
          <h6 className="m-y-0 fw-600">{company}</h6>
          <div className="flex aic"><GoLocation size={15} className="c-medium" /><span className="p-l-5">{city}, {country}</span></div>
        </div>
      </div>
      {/* <a href="/" className="button lite">Відкрито позицій ({vacancies})</a> */}
    </div>
  )

}

export { CompanyCard }