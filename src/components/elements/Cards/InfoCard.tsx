import { ReactNode } from 'react';

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  text: string;
}

const InfoCard = ({ icon, title, text }: InfoCardProps) => {

  return (
    <div className="card p-x-24">
      <div className="flex aic h-p-88">
        <div className="bg-blue r-4 flex aic jcc w-p-48 h-p-48 c-white">{icon}</div>
        <div className="p-l-24 h-p-40">
          <h6 className="m-y-0 fw-600">{title}</h6>
          <p>{text}</p>
        </div>
      </div>
    </div>
  )

}

export { InfoCard }