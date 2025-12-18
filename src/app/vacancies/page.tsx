"use strict";


import { getVacancies } from "@/lib/airtable";
import { VacanciesClient } from "@/components/vacancies/VacanciesClient";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Вакансії | Job Portal",
    description: "Знайдіть роботу своєї мрії серед сотень актуальних вакансій.",
};

export default async function VacanciesPage() {
    const vacancies = await getVacancies();

    return (
        <Suspense fallback={<div className="container p-y-80">Loading...</div>}>
            <VacanciesClient initialVacancies={vacancies} />
        </Suspense>
    );
}
