import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";
// import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext.tsx';
import { Cursor } from './components/MotionPrimitives';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import { BookingProvider } from './components/BookingProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import { DiscountProvider } from './contexts/DiscountContext';
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights } from '@vercel/speed-insights/react';
// import { mountVercelToolbar } from '@vercel/toolbar/vite';

// Page Imports
const HomePage = lazy(() => import("@/react-app/pages/Home"));
const Services = lazy(() => import("@/react-app/pages/Services"));
const Revision360Page = lazy(() => import("@/react-app/pages/Revision360Page"));
// const VIPUltraPremium = lazy(() => import("@/react-app/pages/VIPUltraPremium"));

// Individual Service Pages
const MassatgePage = lazy(() => import("@/react-app/pages/MassatgePage"));
const KinesiologiaPage = lazy(() => import("@/react-app/pages/KinesiologiaPage"));
const NutricioPage = lazy(() => import("@/react-app/pages/NutricioPage"));
const AgenyzPage = lazy(() => import("@/react-app/pages/AgenyzPage"));

// Personal Services (Landing Pages)
const PersonalizedServices = lazy(() => import("@/react-app/pages/PersonalizedServices"));
const OfficeWorkers = lazy(() => import("@/react-app/pages/PersonalizedServices/OfficeWorkers"));
const Musicians = lazy(() => import("@/react-app/pages/PersonalizedServices/Musicians"));
const Athletes = lazy(() => import("@/react-app/pages/PersonalizedServices/Athletes"));
const Artists = lazy(() => import("@/react-app/pages/PersonalizedServices/Artists"));
const Students = lazy(() => import("@/react-app/pages/PersonalizedServices/Students"));

// Personalized Pages (Detailed)
const StudentsPersonalized = lazy(() => import("@/react-app/pages/PersonalizedPages/Students"));
const OfficeWorkersPersonalized = lazy(() => import("@/react-app/pages/PersonalizedPages/OfficeWorkers"));
const MusiciansPersonalized = lazy(() => import("@/react-app/pages/PersonalizedPages/Musicians"));
const AthletesPersonalized = lazy(() => import("@/react-app/pages/PersonalizedPages/Athletes"));
const ParentsPersonalized = lazy(() => import("@/react-app/pages/PersonalizedPages/Parents"));
const AdultsPersonalized = lazy(() => import("@/react-app/pages/PersonalizedPages/Adults"));
const ChildrenPersonalized = lazy(() => import("@/react-app/pages/PersonalizedPages/Children"));
const FamiliesPersonalized = lazy(() => import("@/react-app/pages/PersonalizedPages/Families"));

// Contact Page
const ContactPage = lazy(() => import("@/react-app/pages/Contact"));

// About Elena Page
const AboutElena = lazy(() => import("@/react-app/pages/AboutElena"));
const TechniqueDetail = lazy(() => import("@/react-app/pages/TechniqueDetail"));

// Booking Page
const BookingPage = lazy(() => import("@/react-app/pages/BookingPage"));

// Discovery Form
const DiscoveryForm = lazy(() => import("@/react-app/pages/DiscoveryForm"));
const FirstTimeVisitor = lazy(() => import('./pages/FirstTimeVisitor'));

// Cases Page
const Casos = lazy(() => import('./pages/Casos'));
const CasoDetail = lazy(() => import('./pages/CasoDetail'));

// Discounts Page
const Discounts = lazy(() => import("@/react-app/pages/Discounts"));

// Legal Pages
const PrivacyPolicy = lazy(() => import("@/react-app/pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("@/react-app/pages/CookiePolicy"));
const TermsOfService = lazy(() => import("@/react-app/pages/TermsOfService"));

function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    }>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<Services />} />
      <Route path="/360-revision" element={<Revision360Page />} />

      {/* Individual Service Pages */}
      <Route path="/services/massage" element={<MassatgePage />} />
      <Route path="/services/kinesiology" element={<KinesiologiaPage />} />
      <Route path="/services/nutrition" element={<NutricioPage />} />
      <Route path="/agenyz" element={<AgenyzPage />} />
      {/* <Route path="/vip" element={<VIPUltraPremium />} /> */}

      {/* Personal Services */}
      <Route path="/personalized-services" element={<PersonalizedServices />} />
      <Route path="/services/office-workers" element={<OfficeWorkers />} />
      <Route path="/services/musicians" element={<Musicians />} />
      <Route path="/services/athletes" element={<Athletes />} />
      <Route path="/services/artists" element={<Artists />} />
      <Route path="/services/students" element={<Students />} />
      <Route path="/services/adults" element={<AdultsPersonalized />} />
      <Route path="/services/children" element={<ChildrenPersonalized />} />
      <Route path="/services/families" element={<FamiliesPersonalized />} />

      {/* Personalized Onboarding Pages */}
      <Route path="/for-students" element={<StudentsPersonalized />} />
      <Route path="/for-office-workers" element={<OfficeWorkersPersonalized />} />
      <Route path="/for-musicians" element={<MusiciansPersonalized />} />
      <Route path="/for-athletes" element={<AthletesPersonalized />} />
      <Route path="/for-parents" element={<ParentsPersonalized />} />

      {/* Contact */}
      <Route path="/contact" element={<ContactPage />} />

      {/* About Elena */}
      <Route path="/about-elena" element={<AboutElena />} />
      <Route path="/technique/:id" element={<TechniqueDetail />} />

      {/* Booking */}
      <Route path="/booking" element={<BookingPage />} />

      {/* Discovery Form */}
      <Route path="/discovery" element={<DiscoveryForm />} />
      <Route path="/first-time" element={<FirstTimeVisitor />} />

      {/* Cases */}
      <Route path="/cases" element={<Casos />} />
      <Route path="/cases/:id" element={<CasoDetail />} />

      {/* Discounts */}
      <Route path="/discounts" element={<Discounts />} />

      {/* Legal Pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  /*
  useEffect(() => {
    if (import.meta.env.VITE_VERCEL_ENV !== 'production') {
      mountVercelToolbar();
    }
  }, []);
  */

  return (
      <ErrorBoundary>
        <LanguageProvider>
            <DiscountProvider>
              <Cursor className="bg-blue-500" />
              <Router>
                <BookingProvider>
                  <ScrollToTop />
                  <Layout>
                    <AppRoutes />
                    
                    
                  </Layout>
                </BookingProvider>
              </Router>
            </DiscountProvider>
        </LanguageProvider>
      </ErrorBoundary>
  );
}
