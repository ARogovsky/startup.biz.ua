import { CompanyCard } from "../../components/elements/Cards/CompanyCard"
import { getCompanies } from "../../lib/airtable"

const Companies = async () => {
  const companies = await getCompanies()
  const featuredCompanies = companies.filter(e => e.featured)

  return (
    <section id='featured' className="p-b-120 p-t-60">
      <div className="container">
        <h2 className="title-part">Топ ВНЗ</h2>
        <div className="s-1 m-y-24"></div>
        <div className="row">
          {featuredCompanies.map(e => (
            <div className="col-lg-4 m-y-12" key={e.id}>
              <CompanyCard
                company={e.company}
                city={e.location[0]}
                country={e.location[1]}
                logo={e.logo}
                vacancies={e.vacancies}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Companies }
