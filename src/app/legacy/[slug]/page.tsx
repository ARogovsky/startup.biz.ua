import { Header } from "@/components/Header";
import { PageTitle } from "@/components/elements/PageTitle";
import { Footer } from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

const legacyContentPath = path.join(process.cwd(), 'src/content/legacy');

export async function generateStaticParams() {
    return [
        { slug: 'privacy-policy' },
        { slug: 'terms-of-use' },
        { slug: 'cookie-policy' }
    ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const filePath = path.join(legacyContentPath, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
        return {
            title: 'Not Found'
        };
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return {
        title: data.title
    };
}

export default async function LegacyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const filePath = path.join(legacyContentPath, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const components = {
        h1: ({ node, ...props }: any) => <h1 className="title-sub fz-36 fw-500" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="title-sub fz-32 fw-500" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="title-sub fz-28 fw-500 m-t-24" {...props} />,
        h4: ({ node, ...props }: any) => <h4 className="title-sub fz-24 fw-500 m-b-24" {...props} />,
        p: ({ node, ...props }: any) => <p className="title-sub fz-22 m-y-16" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="title-sub fz-22 m-y-16 m-l-24" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="title-sub fz-22 m-y-16 m-l-24" {...props} />
    };

    return (
        <>
            <Header />
            <PageTitle title={data.title} page="Головна" link="/" />
            <section id="legacy" className="p-b-80">
                <div className="container">
                    <div className="row m-b-80">
                        <h2 className="title-part fz-56">{data.title}</h2>
                        <ReactMarkdown components={components} rehypePlugins={[rehypeRaw]}>
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
