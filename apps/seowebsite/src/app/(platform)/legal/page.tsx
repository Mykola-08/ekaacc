import Link from "next/link";
import { Shield, FileText, Cookie, AlertCircle, ArrowRight, Building2, RefreshCcw, CheckCircle, Accessibility, Copyright, Database, Bug, HeartHandshake, Scale, Leaf, Truck, Ban, Megaphone, Landmark, Users, Share2, Lock, Activity, Laptop, BarChart, Code, TrendingUp, MapPin, Globe, Heart, Video, FileSignature, BookOpen, UserCog, CreditCard, XCircle, Umbrella } from "lucide-react";

export default function Home() {
 return (
  <div className="space-y-12">
   <div className="text-center max-w-2xl mx-auto">
    <h1 className="text-4xl font-bold tracking-tight mb-4">Legal Center</h1>
    <p className="text-lg text-muted-foreground">
     Transparency is core to our values. Here you can find all the legal documents, policies, and agreements that govern your use of EKA Balance.
    </p>
   </div>
   
   <div className="grid md:grid-cols-2 gap-6">
    <Link href="/legal/terms" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
       <FileText className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Terms of Service</h3>
     <p className="text-muted-foreground mb-4">The agreement between you and EKA Balance regarding your use of our platform and services.</p>
     <span className="text-sm font-medium text-primary">Read Terms &rarr;</span>
    </Link>
    
    <Link href="/legal/privacy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-100 transition-colors">
       <Shield className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Privacy Policy</h3>
     <p className="text-muted-foreground mb-4">Detailed information on how we collect, use, store, and protect your personal data.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>
    
    <Link href="/legal/cookies" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-100 transition-colors">
       <Cookie className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Cookie Policy</h3>
     <p className="text-muted-foreground mb-4">Explanation of the cookies we use, why we use them, and how you can manage your preferences.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>
    
    <Link href="/legal/disclaimer" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-red-50 rounded-xl text-red-600 group-hover:bg-red-100 transition-colors">
       <AlertCircle className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Disclaimer</h3>
     <p className="text-muted-foreground mb-4">Important legal disclaimers regarding medical advice, liability, and professional relationships.</p>
     <span className="text-sm font-medium text-primary">Read Disclaimer &rarr;</span>
    </Link>

    <Link href="/legal/imprint" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-100 transition-colors">
       <Building2 className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Legal Notice (Imprint)</h3>
     <p className="text-muted-foreground mb-4">Company identification data, tax information, and registry details as required by Spanish law.</p>
     <span className="text-sm font-medium text-primary">Read Notice &rarr;</span>
    </Link>

    <Link href="/legal/refund-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
       <RefreshCcw className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Refund Policy</h3>
     <p className="text-muted-foreground mb-4">Information about cancellations, refunds, and your right of withdrawal for our services.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/acceptable-use" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors">
       <CheckCircle className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Acceptable Use Policy</h3>
     <p className="text-muted-foreground mb-4">Guidelines on prohibited conduct and how to use our services responsibly and legally.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/accessibility" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-pink-50 rounded-xl text-pink-600 group-hover:bg-pink-100 transition-colors">
       <Accessibility className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Accessibility Statement</h3>
     <p className="text-muted-foreground mb-4">Our commitment to ensuring digital accessibility for people with disabilities.</p>
     <span className="text-sm font-medium text-primary">Read Statement &rarr;</span>
    </Link>

    <Link href="/legal/intellectual-property" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition-colors">
       <Copyright className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Intellectual Property Policy</h3>
     <p className="text-muted-foreground mb-4">Information on copyright, trademarks, and how to report infringement.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/data-processing-agreement" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-100 rounded-xl text-blue-700 group-hover:bg-blue-200 transition-colors">
       <Database className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Data Processing Agreement</h3>
     <p className="text-muted-foreground mb-4">Terms governing the processing of personal data under GDPR and other laws.</p>
     <span className="text-sm font-medium text-primary">Read Agreement &rarr;</span>
    </Link>

    <Link href="/legal/vulnerability-disclosure" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-red-100 rounded-xl text-red-700 group-hover:bg-red-200 transition-colors">
       <Bug className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Vulnerability Disclosure</h3>
     <p className="text-muted-foreground mb-4">How to report security vulnerabilities and our safe harbor policy for researchers.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/community-guidelines" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-green-100 rounded-xl text-green-700 group-hover:bg-green-200 transition-colors">
       <HeartHandshake className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Community Guidelines</h3>
     <p className="text-muted-foreground mb-4">Rules for maintaining a safe, respectful, and supportive community environment.</p>
     <span className="text-sm font-medium text-primary">Read Guidelines &rarr;</span>
    </Link>

    <Link href="/legal/modern-slavery-statement" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-indigo-100 rounded-xl text-indigo-700 group-hover:bg-indigo-200 transition-colors">
       <Scale className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Modern Slavery Statement</h3>
     <p className="text-muted-foreground mb-4">Our commitment to preventing modern slavery and human trafficking in our supply chain.</p>
     <span className="text-sm font-medium text-primary">Read Statement &rarr;</span>
    </Link>

    <Link href="/legal/environmental-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-green-100 rounded-xl text-green-700 group-hover:bg-green-200 transition-colors">
       <Leaf className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Environmental Policy</h3>
     <p className="text-muted-foreground mb-4">Our commitment to sustainability and reducing our environmental impact.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/supplier-code-of-conduct" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-orange-100 rounded-xl text-orange-700 group-hover:bg-orange-200 transition-colors">
       <Truck className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Supplier Code of Conduct</h3>
     <p className="text-muted-foreground mb-4">Standards and expectations for our suppliers regarding labor, ethics, and sustainability.</p>
     <span className="text-sm font-medium text-primary">Read Code &rarr;</span>
    </Link>

    <Link href="/legal/anti-bribery-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-red-100 rounded-xl text-red-700 group-hover:bg-red-200 transition-colors">
       <Ban className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Anti-Bribery Policy</h3>
     <p className="text-muted-foreground mb-4">Our zero-tolerance approach to bribery and corruption in all business dealings.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/whistleblower-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-100 rounded-xl text-blue-700 group-hover:bg-blue-200 transition-colors">
       <Megaphone className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Whistleblower Policy</h3>
     <p className="text-muted-foreground mb-4">Channels and protections for reporting unethical or illegal conduct.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/kyc-aml-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-cyan-100 rounded-xl text-cyan-700 group-hover:bg-cyan-200 transition-colors">
       <Landmark className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">KYC & AML Policy</h3>
     <p className="text-muted-foreground mb-4">Procedures for identity verification and prevention of money laundering.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/dei-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-pink-100 rounded-xl text-pink-700 group-hover:bg-pink-200 transition-colors">
       <Users className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Diversity, Equity & Inclusion</h3>
     <p className="text-muted-foreground mb-4">Our commitment to fostering a diverse and inclusive workplace culture.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/social-media-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-100 rounded-xl text-blue-700 group-hover:bg-blue-200 transition-colors">
       <Share2 className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Social Media Policy</h3>
     <p className="text-muted-foreground mb-4">Guidelines for professional and personal use of social media by employees.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/business-continuity-plan" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-indigo-100 rounded-xl text-indigo-700 group-hover:bg-indigo-200 transition-colors">
       <Activity className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Business Continuity Plan</h3>
     <p className="text-muted-foreground mb-4">Strategies to ensure critical business functions continue during disruptions.</p>
     <span className="text-sm font-medium text-primary">Read Plan &rarr;</span>
    </Link>

    <Link href="/legal/remote-work-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-100 rounded-xl text-blue-700 group-hover:bg-blue-200 transition-colors">
       <Laptop className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Remote Work Policy</h3>
     <p className="text-muted-foreground mb-4">Guidelines and expectations for employees working remotely.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/service-level-agreement" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-100 rounded-xl text-blue-700 group-hover:bg-blue-200 transition-colors">
       <BarChart className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Service Level Agreement</h3>
     <p className="text-muted-foreground mb-4">Performance commitments and guarantees for our enterprise customers.</p>
     <span className="text-sm font-medium text-primary">Read SLA &rarr;</span>
    </Link>

    <Link href="/legal/api-terms-of-use" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-muted rounded-xl text-foreground/90 group-hover:bg-gray-200 transition-colors">
       <Code className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">API Terms of Use</h3>
     <p className="text-muted-foreground mb-4">Terms governing the access and use of our Application Programming Interface.</p>
     <span className="text-sm font-medium text-primary">Read Terms &rarr;</span>
    </Link>

    <Link href="/legal/affiliate-program-terms" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-orange-100 rounded-xl text-orange-700 group-hover:bg-orange-200 transition-colors">
       <TrendingUp className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Affiliate Program Terms</h3>
     <p className="text-muted-foreground mb-4">Conditions for participating in our affiliate marketing program.</p>
     <span className="text-sm font-medium text-primary">Read Terms &rarr;</span>
    </Link>

    <Link href="/legal/gdpr-compliance" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-indigo-100 rounded-xl text-indigo-700 group-hover:bg-indigo-200 transition-colors">
       <Globe className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">GDPR Compliance</h3>
     <p className="text-muted-foreground mb-4">Our commitment to data protection for users in the EEA.</p>
     <span className="text-sm font-medium text-primary">Read Statement &rarr;</span>
    </Link>

    <Link href="/legal/compliance/ropa" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-muted rounded-xl text-foreground/90 group-hover:bg-slate-200 transition-colors">
       <FileText className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Record of Processing Activities</h3>
     <p className="text-muted-foreground mb-4">Overview of our data processing activities as required by Article 30 GDPR.</p>
     <span className="text-sm font-medium text-primary">View Records &rarr;</span>
    </Link>

    <Link href="/legal/childrens-privacy-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-pink-100 rounded-xl text-pink-700 group-hover:bg-pink-200 transition-colors">
       <Heart className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Children&apos;s Privacy Policy</h3>
     <p className="text-muted-foreground mb-4">Information regarding the collection of data from children.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/telehealth-consent" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-purple-100 rounded-xl text-purple-700 group-hover:bg-purple-200 transition-colors">
       <Video className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Telehealth Consent</h3>
     <p className="text-muted-foreground mb-4">Consent for receiving healthcare services via remote technologies.</p>
     <span className="text-sm font-medium text-primary">Read Consent &rarr;</span>
    </Link>

    <Link href="/legal/patient-rights" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-100 rounded-xl text-blue-700 group-hover:bg-blue-200 transition-colors">
       <Scale className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Patient Rights</h3>
     <p className="text-muted-foreground mb-4">Your rights and responsibilities as a patient at EKA Balance.</p>
     <span className="text-sm font-medium text-primary">Read Rights &rarr;</span>
    </Link>

    <Link href="/legal/informed-consent" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-100 rounded-xl text-blue-700 group-hover:bg-blue-200 transition-colors">
       <FileSignature className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Informed Consent</h3>
     <p className="text-muted-foreground mb-4">General consent form for treatment and understanding of risks.</p>
     <span className="text-sm font-medium text-primary">Read Form &rarr;</span>
    </Link>

    <Link href="/legal/code-of-ethics" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-amber-100 rounded-xl text-amber-700 group-hover:bg-amber-200 transition-colors">
       <BookOpen className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Code of Ethics</h3>
     <p className="text-muted-foreground mb-4">Our commitment to integrity and ethical conduct in all our operations.</p>
     <span className="text-sm font-medium text-primary">Read Code &rarr;</span>
    </Link>

    <Link href="/legal/workplace-harassment-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-red-100 rounded-xl text-red-700 group-hover:bg-red-200 transition-colors">
       <Ban className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Workplace Harassment Policy</h3>
     <p className="text-muted-foreground mb-4">Zero-tolerance policy for harassment and discrimination.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/employee-privacy-notice" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-muted rounded-xl text-foreground/90 group-hover:bg-slate-200 transition-colors">
       <UserCog className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Employee Privacy Notice</h3>
     <p className="text-muted-foreground mb-4">How we handle and protect the personal data of our employees.</p>
     <span className="text-sm font-medium text-primary">Read Notice &rarr;</span>
    </Link>

    <Link href="/legal/payment-terms" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-green-100 rounded-xl text-green-700 group-hover:bg-green-200 transition-colors">
       <CreditCard className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Payment Terms</h3>
     <p className="text-muted-foreground mb-4">Terms governing payments, billing cycles, and fees for our services.</p>
     <span className="text-sm font-medium text-primary">Read Terms &rarr;</span>
    </Link>

    <Link href="/legal/cancellation-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-red-100 rounded-xl text-red-700 group-hover:bg-red-200 transition-colors">
       <XCircle className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Cancellation Policy</h3>
     <p className="text-muted-foreground mb-4">Rules regarding appointment cancellations, rescheduling, and no-shows.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/insurance-policy" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-100 rounded-xl text-blue-700 group-hover:bg-blue-200 transition-colors">
       <Umbrella className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Insurance Policy</h3>
     <p className="text-muted-foreground mb-4">Information on insurance coverage, claims, and liability.</p>
     <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
    </Link>

    <Link href="/legal/data-request" className="group block p-8 border-none rounded-[32px] hover:border-primary/50 hover:shadow-md transition-all bg-card">
     <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
       <Database className="w-6 h-6" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
     </div>
     <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Data Rights Request</h3>
     <p className="text-muted-foreground mb-4">Exercise your rights to access, correct, or delete your personal data.</p>
     <span className="text-sm font-medium text-primary">Submit Request &rarr;</span>
    </Link>
   </div>

   <div className="py-12 border-t border-b">
    <h2 className="text-2xl font-bold text-center mb-8">Compliance & Certifications</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
     <div className="flex flex-col items-center space-y-2">
      <div className="p-4 bg-blue-50 rounded-full text-blue-600">
       <Shield className="w-8 h-8" />
      </div>
      <h3 className="font-semibold text-sm">GDPR Compliant</h3>
      <p className="text-xs text-muted-foreground">EU Data Protection</p>
     </div>

    </div>
   </div>

   <div className="mt-12 p-6 bg-muted/30 rounded-[32px] border-none text-center">
    <h3 className="font-semibold mb-2">Questions about our legal policies?</h3>
    <p className="text-muted-foreground mb-4">
     If you have any questions or concerns about these documents, please contact our legal team.
    </p>
    <a href="mailto:legal@ekabalance.com" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary/90 shadow-sm">
     Contact Legal Team
    </a>
   </div>
  </div>
 );
}
