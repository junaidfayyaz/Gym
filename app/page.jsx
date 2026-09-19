import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import FacilitiesSection from '@/components/public/FacilitiesSection';
import PlansSection from '@/components/public/PlansSection';
import ScheduleSection from '@/components/public/ScheduleSection';
import BMICalculator from '@/components/public/BMICalculator';
import ContactForm from '@/components/public/ContactForm';
import Footer from '@/components/public/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FacilitiesSection />
        <PlansSection />
        <ScheduleSection />
        <BMICalculator />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
