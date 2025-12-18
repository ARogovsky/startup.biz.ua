import Link from "next/link"
import { FiChevronRight } from "react-icons/fi"

const dark = '#1e1e1e'

interface PageTitleProps {
  page?: string;
  link?: string;
  title: string;
}

const PageTitle = (props: PageTitleProps) => {

  return (
    <div className="page-title bg-light">
      <div className="container m-p-x-16">
        {props.page && props.link &&
          <>
            <Link href={props.link} className="title-sub m-hide fw-400">{props.page}</Link>
            <FiChevronRight className='title-sub m-x-4 m-hide' style={{ color: dark }} size={24} />
          </>
        }
        <h2 className="title-sub m-0 fw-400">{props.title}</h2>
      </div>
    </div>
  )
}

export { PageTitle }