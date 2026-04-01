import {
  GoPerson,
  GoUpload,
  GoRuby,
  GoIssueClosed
} from "react-icons/go"
import Link from 'next/link'

import how from "../../data/how"

const How = () => {
  return (
    <section id='how' className="m-y-80 p-y-120 bg-violet c-white">
      <div className="container tc">
        <h2 className="title-part">Як це працює</h2>
        <div className="s-1 m-y-24"></div>
        <div className="row">
          <div className="col-lg-3 m-y-16">
            <div className="w-p-80 h-p-80 bg-white r-40 flex aic jcc m-b-24 ma c-violet">
              <GoPerson size={40} />
            </div>
            <h3><Link href="/" className="title p-y-8">{how[0].title}</Link></h3>
            <p className="title-sub p-x-8 p-t-8">{how[0].text}</p>
          </div>
          <div className="col-lg-3 m-y-16">
            <div className="w-p-80 h-p-80 bg-white r-40 flex aic jcc m-b-24 ma c-violet">
              <GoUpload size={40} />
            </div>
            <h3><Link href="/" className="title p-y-8">{how[1].title}</Link></h3>
            <p className="title-sub p-x-8 p-t-8">{how[1].text}</p>
          </div>
          <div className="col-lg-3 m-y-16">
            <div className="w-p-80 h-p-80 bg-white r-40 flex aic jcc m-b-24 ma c-violet">
              <GoRuby size={40} />
            </div>
            <h3><Link href="/" className="title p-y-8">{how[2].title}</Link></h3>
            <p className="title-sub p-x-8 p-t-8">{how[2].text}</p>
          </div>
          <div className="col-lg-3 m-y-16">
            <div className="w-p-80 h-p-80 bg-white r-40 flex aic jcc m-b-24 ma c-violet">
              <GoIssueClosed size={40} />
            </div>
            <h3><Link href="/" className="title p-y-8">{how[3].title}</Link></h3>
            <p className="title-sub p-x-8 p-t-8">{how[3].text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { How }