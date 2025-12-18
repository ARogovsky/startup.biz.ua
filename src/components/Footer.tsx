import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const year = new Date()
  return (
    <footer id='contact' className='w-100 flex jcc aic bg-light p-t-80 p-b-60'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-4 m-center'>
            <p className="title-mini"><Link href='/'>ГО &quot;ТопИздаТо&quot;</Link>@{year.getFullYear()} - Всі права захищено</p>
          </div>
          <div className='col-lg-8 tr'>
            <p>
              <Link href='/legacy/privacy-policy' target='blank' className="title-mini">
                Політика кофіденційності
              </Link>
              <Link href='/legacy/terms-of-use' target='blank' className='title-mini mx-4'>
                Умови використання
              </Link>
              <Link href='/legacy/cookie-policy' target='blank' className="title-mini">
                Політика файлів Cookie
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
