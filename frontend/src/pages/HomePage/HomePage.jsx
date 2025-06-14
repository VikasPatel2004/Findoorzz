import React, { useEffect, useState } from 'react';
import HomeSection from '../../components/HomeComponents/HomeSection';
import CardSection from '../../components/HomeComponents/CardSection';
import HowItWorksSection from '../../components/HomeComponents/HowItWorks';
import FeatureSection from '../../components/HomeComponents/FeaturesSection';

function HomePage() {
    const [isCard1Visible, setIsCard1Visible] = useState(false);
    const [isCard2Visible, setIsCard2Visible] = useState(false);
    const [isWorksVisible, setIsWorksVisible] = useState(false);

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
        </div>
    );
}

export default HomePage;