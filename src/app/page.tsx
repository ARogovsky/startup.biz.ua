
import { Header } from '@/components/Header';
import { Hero } from '@/components/parts/Hero'; // Moved from pages/parts to components/parts
import { Popular } from '@/components/parts/Popular';
import { How } from '@/components/parts/How';
import { Categories } from '@/components/parts/Categories';
import { Featured } from '@/components/parts/Featured';
import { Footer } from '@/components/Footer';
import { Companies } from '@/components/parts/Companies';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Popular />
      <How />
      <Categories />
      <Featured />
      <Companies />
      <Footer />
    </>
  );
}
