"use client";

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { PageTitle } from '@/components/elements/PageTitle'
import { VacancyCard } from '@/components/elements/Cards/VacancyCard'
import { Footer } from '@/components/Footer'
import { Input, Select, Pagination } from 'antd'
import { Vacancy } from '@/utils/markdownParser'

const ITEMS_PER_PAGE = 12

interface VacanciesClientProps {
    initialVacancies: Vacancy[]
}

const VacanciesClient = ({ initialVacancies }: VacanciesClientProps) => {
    const [filters, setFilters] = useState({
        keyword: '',
        type: '',
        salary: '',
        company: '',
        location: ''
    })

    const searchParams = useSearchParams()
    const router = useRouter()

    // Derive start page from URL
    const pageParam = searchParams ? searchParams.get('page') : '1'
    const currentPage = pageParam ? parseInt(pageParam) : 1

    // We don't need local state for currentPage if we rely on URL, 
    // but the Pagination component needs `current` and `onChange`.
    // If we use URL as source of truth, `handlePageChange` should just push URL.
    // Let's stick to URL as source of truth to avoid sync issues.

    // Filter logic using useMemo
    const filteredVacancies = useMemo(() => {
        const keyword = filters.keyword.toLowerCase()

        return initialVacancies.filter(v => {
            const locString = Array.isArray(v.location) ? v.location.join(' ') : v.location;
            const salaryString = Array.isArray(v.salary) ? `$${v.salary[0]}K-$${v.salary[1]}K` : String(v.salary);

            const matchKeyword =
                v.vacancy.toLowerCase().includes(keyword) ||
                v.company.toLowerCase().includes(keyword) ||
                locString.toLowerCase().includes(keyword)

            const matchType = filters.type ? v.type === filters.type : true
            const matchSalary = filters.salary ? salaryString === filters.salary : true
            const matchCompany = filters.company ? v.company === filters.company : true
            const matchLocation = filters.location ? (Array.isArray(v.location) ? v.location[0] : v.location) === filters.location : true

            return matchKeyword && matchType && matchSalary && matchCompany && matchLocation
        })
    }, [filters, initialVacancies])

    // Reset page to 1 if filters change
    useEffect(() => {
        if (currentPage !== 1) {
            // If we are deep in pages and filter changes, results might be empty on that page.
            // We should reset to page 1.
            // But we need to distinguish between initial load and filter change.
            // With useMemo, this effect runs when `filters` changes.
            // We can check if `filteredVacancies` length changed? No.
            // We just want to ensure we're on page 1 if we change a filter.
            router.push('/vacancies?page=1')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters])

    // Remove old state and effects




    const handleChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value || '' }))
    }

    const handlePageChange = (page: number) => {
        router.push(`/vacancies?page=${page}`)
    }

    // Rewrite unique to handle arrays. 
    // If key is 'location', we want unique cities (v.location[0]) if it's an array.
    // If key is 'salary', we want string definition.
    const unique = (key: keyof Vacancy): string[] => {
        const values = initialVacancies.map(v => {
            if (key === 'location' && Array.isArray(v.location)) return v.location[0]; // City
            if (key === 'salary' && Array.isArray(v.salary)) return `$${v.salary[0]}K-$${v.salary[1]}K`;
            return String(v[key]);
        });
        return Array.from(new Set(values));
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedVacancies = filteredVacancies.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    return (
        <>
            <Header />
            <PageTitle title='Вакансії' page='Головна' link='/' />
            <section id="vacancies" className='p-b-80'>
                <div className="container">
                    <div className="row m-b-24">
                        <div className="col-lg-4">
                            <Input
                                className='w-100 flex'
                                placeholder="Пошук..."
                                value={filters.keyword}
                                onChange={e => handleChange('keyword', e.target.value)}
                                allowClear
                            />
                        </div>
                        <div className="col-lg-2">
                            <Select
                                className='w-100'
                                placeholder="Тип"
                                options={unique('type').map(v => ({ label: v, value: v }))}
                                onChange={val => handleChange('type', val)}
                                allowClear
                            />
                        </div>
                        <div className="col-lg-2">
                            <Select
                                className='w-100'
                                placeholder="Зарплата"
                                options={unique('salary').map(v => ({ label: v, value: v }))}
                                onChange={val => handleChange('salary', val)}
                                allowClear
                            />
                        </div>
                        <div className="col-lg-2">
                            <Select
                                className='w-100'
                                placeholder="Компанія"
                                options={unique('company').map(v => ({ label: v, value: v }))}
                                onChange={val => handleChange('company', val)}
                                allowClear
                            />
                        </div>
                        <div className="col-lg-2">
                            <Select
                                className='w-100'
                                placeholder="Локація"
                                options={unique('location').map(v => ({ label: v, value: v }))}
                                onChange={val => handleChange('location', val)}
                                allowClear
                            />
                        </div>
                    </div>

                    <div className="row">
                        {paginatedVacancies.map(e => (
                            <div className="col-lg-4 m-y-12" key={e.slug}>
                                <VacancyCard
                                    vacancy={e.vacancy}
                                    type={e.type}
                                    salary={e.salary}
                                    company={e.company}
                                    location={e.location}
                                    logo={e.logo}
                                    slug={e.slug}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="row m-t-24">
                        <div className="col-12 d-flex justify-content-center">
                            <Pagination
                                current={currentPage}
                                pageSize={ITEMS_PER_PAGE}
                                total={filteredVacancies.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export { VacanciesClient }
