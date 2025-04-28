import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import BestsellersSection from '../components/home/BestsellersSection';
import AboutSection from '../components/home/AboutSection';
import CategoriesSection from '../components/home/CategoriesSection';
import DiscountSection from '../components/home/DiscountSection';
import ReviewsSection from '../components/home/ReviewsSection';
import Modal from '../components/ui/Modal';
import ContactForm from '../components/contact/ContactForm';
import { Phone } from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleContactSuccess = () => {
    setIsContactModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <Layout>
      <HeroSection />
      <BestsellersSection />
      <AboutSection />
      <CategoriesSection />
      <DiscountSection />
      <ReviewsSection />

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <Button
          onClick={() => setIsContactModalOpen(true)}
          className="rounded-full w-14 h-14 flex items-center justify-center"
          aria-label="Contact Us"
        >
          <Phone size={24} />
        </Button>
      </div>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Request a Consultation"
      >
        <p className="text-gray-600 mb-6 font-light">
          Fill out the form below and our design consultant will contact you shortly.
        </p>
        <ContactForm onSuccess={handleContactSuccess} />
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Thank You!"
      >
        <p className="text-gray-600 mb-6 font-light">
          Your request has been submitted successfully. Our team will contact you within 24 hours.
        </p>
        <Button onClick={() => setIsSuccessModalOpen(false)} fullWidth>
          Close
        </Button>
      </Modal>
    </Layout>
  );
};

export default HomePage;