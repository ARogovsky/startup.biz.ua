import { getVacancies } from "../../lib/airtable"
import Link from 'next/link'

const Popular = async () => {
  const vacancies = await getVacancies()
  const countsMap = vacancies.reduce((acc: Record<string, number>, v) => {
    const name = (v.vacancy || '').trim()
    if (!name) return acc
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const popular = Object.entries(countsMap)
    .map(([vacancy, number]) => ({ vacancy, number }))
    .sort((a, b) => b.number - a.number)
    .slice(0, 8)
  return (
    <section id="popular" className="m-y-80 p-y-80">
      <div className="container">
        <h2 className="title-part">Найпопулярніші напрямки</h2>
        <div className="s-1 m-y-40 bg-grey"></div>
        <div className="row">
          {popular.map(e => (
            <div className="col-lg-3 m-y-16" key={e.vacancy}>
              <h3 className="m-y-3 p-y-2"><Link href="/vacancies" className="title c-blue">{e.vacancy}</Link></h3>
              <p className="title-mini">{e.number} відкриті вакансії</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Popular }