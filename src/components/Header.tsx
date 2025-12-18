"use client";

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  const [opened, setOpened] = useState(true)

  return (
    <header className='bg-white'>
      <div className='container'>
        <div className='flex jcsb aic'>
          <h1 id='logo'>
            <Link href='/' aria-label='Logotype' className='flex aic fz-18 fw-500'>
              <Image src="/assets/logo.svg" width={48} height={44} alt='Логотип' />
              <span className='c-dark fz-20 px-2'>Робота для початківців</span>
            </Link>
          </h1>
          <div
            className={opened ? 'burger open' : 'burger'}
            onClick={() => setOpened(!opened)}
          >
            <span className='tt'></span>
            <span className='mm'></span>
            <span className='bb'></span>
          </div>
          <div className={opened ? 'menu' : 'menu active'}>
            <Link
              href='/vacancies'
              className='mx-3 px-1'
              onClick={() => setOpened(!opened)}
            >
              <p className='fs-12 c-grey-4'>It&apos;s easy.</p>
              Вакансії
            </Link>
            <Link
              href='/contact'
              className='button green top m-l-16'
              onClick={() => setOpened(!opened)}
            >
              Зворотній зв'язок
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header }
