import Link from 'next/link'
import Image from 'next/image'
import { InfoCard } from '../../components/elements/Cards/InfoCard'
import { GoBriefcase, GoOrganization, GoPeople, GoRocket } from "react-icons/go"
import { getVacancies, getCompanies, getStudents } from "../../lib/airtable"

import pic from '../../assets/images/hero.svg'

const Hero = async () => {
  const vacancies = await getVacancies()
  const companies = await getCompanies()
  const students = await getStudents()

  const hotVacanciesCount = vacancies.filter(v => v.featured).length
  const totalVacanciesCount = vacancies.length
  const companiesCount = companies.length
  const studentsCount = students.length
  // We don't have "Students" count in Airtable yet, maybe use Applications if we had them, or just keep static or random for now, or use Categories count?
  // Let's use Categories count for the last one or just keep 33 for now. Or 0?
  // User said "All info wil come from aitrtables".
  // Let's assume the 4th stat is "Partners" or something we can derive?
  // "Students" is hard. I'll leave it as "Mentors" or "Categories"?
  // "InfoCard title='33' text='Студентів'". 
  // Maybe I'll just hardcode 100+ or leave it?
  // I will leave "Students" as is for now as we don't have a Users/Students table. 
  // But I will update the others.

  return (
    <section id="top" className='bg-light p-y-120'>
      <div className="container">
        <div className="row">
          <div className="m-show col-lg-5">
            <div className="flex aic jcc p-b-40">
              <Image src={pic} alt="hero" width={400} height={400} />
            </div>
          </div>
          <div className="col-lg-7 flex aic p-b-40">
            <div>
              <h1 className="title-intro c-white">Твоя перша робота у<br />стартапі</h1>
              <h2 className='title-intro-sub c-light'>Знайди стажування або роботу без досвіду</h2>
              <div className="flex p-y-24 m-center">
                <Link href="/contact?tab=candidate" className="button pink">Знайти роботу</Link>
                <Link href="/contact?tab=vacancy" className="button green mx-3">Розмістити вакансію</Link>
              </div>
            </div>
          </div>
          <div className="m-hide col-lg-5">
            <div className="flex aic jcfe p-b-40">
              <Image src={pic} alt="hero" width={460} height={360} />
            </div>
          </div>
        </div>
        <div className="row m-y-40">
          <div className="col-lg-3">
            <InfoCard
              title={hotVacanciesCount.toString()}
              text='Гарячі вакансії'
              icon={<GoBriefcase size={24} />}
            />
          </div>
          <div className="col-lg-3">
            <InfoCard
              title={totalVacanciesCount.toString()}
              text='Вакансії' // Was "Проекти" (Projects) but we have Vacancies. Let's call it Vacancies? Or Projects?
              // "Project" context in startup portal often means vacancies/roles. 
              // Original text was "354 Проекти".
              // Let's keep "Проекти" if that's the terminology, or switch to "Вакансії".
              // Matches icon GoOrganization? No that's next one.
              // GoBriefcase -> Hot Vacancies.
              // GoOrganization -> Projects?
              // GoPeople -> Startups?
              // GoRocket -> Students?
              // Let's map: 
              // Hot Vacancies -> hotVacanciesCount
              // Projects -> totalVacanciesCount (assuming project = vacancy)
              // Startups -> companiesCount
              icon={<GoOrganization size={24} />}
            />
          </div>
          <div className="col-lg-3">
            <InfoCard
              title={companiesCount.toString()}
              text='Стартапів'
              icon={<GoPeople size={24} />}
            />
          </div>
          <div className="col-lg-3">
            <InfoCard
              title={studentsCount.toString()}
              text='Студентів'
              icon={<GoRocket size={24} />}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }