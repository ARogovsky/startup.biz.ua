import { InfoCard } from '../../components/elements/Cards/InfoCard'
import { GoTerminal, GoTable, GoWorkflow, GoTasklist, GoDeviceDesktop, GoInfinity, GoDeviceMobile, GoReport } from "react-icons/go"

import { getCategories } from "../../lib/airtable"

const Categories = async () => {
  const cats = await getCategories()
  return (
    <section id='categories' className="m-y-80 p-y-80">
      <div className="container">
        <h2 className="title-part">Напрями студентської практики:</h2>
        <div className="s-1 m-y-24"></div>
        <div className="row">
          <div className="col-lg-3 m-y-12">
            <InfoCard
              title={cats[0].title}
              text={cats[0].opens}
              icon={<GoTerminal size={24} />}
            />
          </div>
          <div className="col-lg-3 m-y-12">
            <InfoCard
              title={cats[1].title}
              text={cats[2].opens}
              icon={<GoTable size={24} />}
            />
          </div>
          <div className="col-lg-3 m-y-12">
            <InfoCard
              title={cats[2].title}
              text={cats[3].opens}
              icon={<GoWorkflow size={24} />}
            />
          </div>
          <div className="col-lg-3 m-y-12">
            <InfoCard
              title={cats[3].title}
              text={cats[3].opens}
              icon={<GoTasklist size={24} />}
            />
          </div>
          <div className="col-lg-3 m-y-12">
            <InfoCard
              title={cats[4].title}
              text={cats[4].opens}
              icon={<GoDeviceDesktop size={24} />}
            />
          </div>
          <div className="col-lg-3 m-y-12">
            <InfoCard
              title={cats[5].title}
              text={cats[5].opens}
              icon={<GoInfinity size={24} />}
            />
          </div>
          <div className="col-lg-3 m-y-12">
            <InfoCard
              title={cats[6].title}
              text={cats[6].opens}
              icon={<GoDeviceMobile size={24} />}
            />
          </div>
          <div className="col-lg-3 m-y-12">
            <InfoCard
              title={cats[7].title}
              text={cats[7].opens}
              icon={<GoReport size={24} />}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export { Categories }