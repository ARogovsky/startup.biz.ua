import { VacancyCard } from "../../components/elements/Cards/VacancyCard"
import { getVacancies } from "../../lib/airtable"

const Featured = async () => {
  const vacancies = await getVacancies()
  const featuredVacancies = vacancies.filter(v => v.featured)

  return (
    <section id='featured' className="m-y-80 p-y-120 bg-light">
      <div className="container">
        <h2 className="title-part">Гарячі вакансії</h2>
        <div className="s-1 m-y-24"></div>
        <div className="row">
          {featuredVacancies.map(e => (
            <div className="col-lg-4 m-y-12" key={e.slug}>
              <VacancyCard
                vacancy={e.vacancy}
                type={e.type}
                salary={e.salary}
                company={e.company}
                location={e.location}
                logo={e.logo}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Featured }
