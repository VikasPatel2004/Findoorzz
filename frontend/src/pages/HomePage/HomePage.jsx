import React, { useEffect, useState } from 'react';
import HomeSection from '../../components/HomeComponents/HomeSection';
import CardSection from '../../components/HomeComponents/CardSection';
import HowItWorksSection from '../../components/HomeComponents/HowItWorks';
import FeatureSection from '../../components/HomeComponents/FeaturesSection';
import HomeCards from "../../components/HomeComponents/RoomCards";
import ReviewSlider from "../../components/HomeComponents/ReviewSlides";
import LegalInformation from '../../assets/LegalInformation.svg';

function LegalInformationSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* SVG Illustration */}
        <div className="w-full md:w-1/2 flex justify-center items-center bg-gradient-to-br from-amber-50 to-amber-100 p-8">
          <img src={LegalInformation} alt="Legal Information" className=" h-80 object-contain" />
        </div>
        {/* Legal Links */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Legal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
            <a 
              href="/privacy" 
              className="flex items-center justify-center text-blue-900 hover:text-blue-800 hover:underline transition-colors px-6 py-4 bg-white rounded-xl shadow-md border border-gray-200 font-semibold text-base text-center"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="flex items-center justify-center text-blue-900 hover:text-blue-800 hover:underline transition-colors px-6 py-4 bg-white rounded-xl shadow-md border border-gray-200 font-semibold text-base text-center"
            >
              Terms of Service
            </a>
            <a 
              href="/refund-policy" 
              className="flex items-center justify-center text-blue-900 hover:text-blue-800 hover:underline transition-colors px-6 py-4 bg-white rounded-xl shadow-md border border-gray-200 font-semibold text-base text-center"
            >
              Refund Policy
            </a>
            <a 
              href="/cancellation-policy" 
              className="flex items-center justify-center text-blue-900 hover:text-blue-800 hover:underline transition-colors px-6 py-4 bg-white rounded-xl shadow-md border border-gray-200 font-semibold text-base text-center"
            >
              Cancellation Policy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
    const [isCard1Visible, setIsCard1Visible] = useState(false);
    const [isCard2Visible, setIsCard2Visible] = useState(false);
    const [isWorksVisible, setIsWorksVisible] = useState(false);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleScroll = () => {
        // Check visibility for each section using their IDs
        const card1 = document.getElementById('card1-section');
        const card2 = document.getElementById('card2-section');
        const works = document.getElementById('works-section');
        
        const windowHeight = window.innerHeight;

        if (card1) {
            const card1Position = card1.getBoundingClientRect().top;
            if (card1Position < windowHeight * 0.8) {
                setIsCard1Visible(true);
            }
        }

        if (card2) {
            const card2Position = card2.getBoundingClientRect().top;
            if (card2Position < windowHeight * 0.8) {
                setIsCard2Visible(true);
            }
        }

        if (works) {
            const worksPosition = works.getBoundingClientRect().top;
            if (worksPosition < windowHeight * 0.8) {
                setIsWorksVisible(true);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Initial check on mount
        handleScroll();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return ( 
        <div>
            <HomeSection />
            <CardSection 
                isCard1Visible={isCard1Visible} 
                isCard2Visible={isCard2Visible} 
            />
            <HowItWorksSection isVisible={isWorksVisible} />
            <FeatureSection isVisible={isWorksVisible} />
            <ReviewSlider/>
            {/* Legal Links Section */}
            <LegalInformationSection />
        </div>
    );
}

export default HomePage;