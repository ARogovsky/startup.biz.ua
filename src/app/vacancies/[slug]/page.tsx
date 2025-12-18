import { getVacancy, getVacancySlugs } from "@/lib/airtable";
import { Header } from "@/components/Header";
import { PageTitle } from "@/components/elements/PageTitle";
import { Footer } from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { GoLocation } from "react-icons/go";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Force static generation for all paths
export async function generateStaticParams() {
    const slugs = await getVacancySlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const vacancy = await getVacancy(slug);

    if (!vacancy) {
        return {
            title: "Vacancy Not Found",
        };
    }

    return {
        title: `${vacancy.vacancy} | ${vacancy.company}`,
        description: `Vacancy for ${vacancy.vacancy} at ${vacancy.company}`,
    };
}

export default async function VacancyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Attempt to fetch vacancy. Note: getVacancy in airtable.ts should handle slug matching
    const vacancy = await getVacancy(slug);

    if (!vacancy) {
        notFound();
    }

    const components = {
        h1: ({ node, ...props }: any) => <h1 className="title-sub fz-32 fw-500" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="title-sub fz-28 fw-500" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="title-sub fz-24 fw-500" {...props} />,
        h4: ({ node, ...props }: any) => <h4 className="title-sub fz-20 fw-500" {...props} />,
        p: ({ node, ...props }: any) => <p className="title-sub fz-18 p-b-16" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="title-sub fz-18 p-b-16" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="title-sub fz-18 p-b-16" {...props} />,
    };

    // Helper handling
    const salaryString = Array.isArray(vacancy.salary) ? `$${vacancy.salary[0]}K-$${vacancy.salary[1]}K` : vacancy.salary;
    const locationString = Array.isArray(vacancy.location) ? `${vacancy.location[0]}, ${vacancy.location[1]}` : vacancy.location;


    return (
        <>
            <Header />
            <PageTitle title={vacancy.vacancy} page="Вакансії" link="/vacancies" />
            <div className="container m-b-80">
                <div className="row">
                    <div className="col-lg-9 p-r-24">
                        <div className="flex aic h-p-80">
                            <Image
                                src={`/logos/${vacancy.logo}.png`}
                                alt={vacancy.company}
                                width={80}
                                height={80}
                                style={{ objectFit: "contain" }}
                            />
                            <div className="p-l-16 h-p-80">
                                <h3 className="m-t-4 m-b-0 fw-600">{vacancy.vacancy}</h3>
                                <div className="flex aic">
                                    <h5 className="p-r-16 m-t-6">{vacancy.company}</h5>
                                    <span className="p-x-6 p-t-2 p-b-1 bg-hero r-4 m-r-8 c-blue upp title">
                                        {vacancy.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="s-1 bg-grey m-t-32 m-b-40 w-96"></div>
                        <div className="vacancy-content">
                            <ReactMarkdown components={components} rehypePlugins={[rehypeRaw]}>
                                {vacancy.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <div className="col-lg-3 tc p-l-40">
                        <div className="card p-t-28 m-b-40">
                            <div className="flex aic jcc">
                                <GoLocation size={18} className="c-medium" />
                                <span className="p-l-8 fw-400">{locationString}</span>
                            </div>
                            <div className="s-1 bg-grey m-y-24"></div>
                            <p className="fw-400 m-b-5">Зарплата за рік:</p>
                            <h5 className="m-t-0 m-b-28">{salaryString}</h5>
                            <Link
                                href={`/contact?tab=candidate&ref=${encodeURIComponent(
                                    vacancy.slug
                                )}&title=${encodeURIComponent(
                                    vacancy.vacancy
                                )}&company=${encodeURIComponent(
                                    vacancy.company
                                )}&type=${encodeURIComponent(vacancy.type)}&location=${encodeURIComponent(
                                    String(locationString)
                                )}`}
                                className="button fw-400"
                            >
                                Подати заявку
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
