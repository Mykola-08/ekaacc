import Link from 'next/link';
import {
  Shield,
  FileText,
  Cookie,
  AlertCircle,
  ArrowRight,
  Building2,
  RefreshCcw,
  CheckCircle,
  Accessibility,
  Copyright,
  Database,
  Bug,
  HeartHandshake,
  Scale,
  Leaf,
  Truck,
  Ban,
  Megaphone,
  Landmark,
  Users,
  Share2,
  Lock,
  Activity,
  Laptop,
  BarChart,
  Code,
  TrendingUp,
  MapPin,
  Globe,
  Heart,
  Video,
  FileSignature,
  BookOpen,
  UserCog,
  CreditCard,
  XCircle,
  Umbrella,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight">Legal Center</h1>
        <p className="text-muted-foreground text-lg">
          Transparency is core to our values. Here you can find all the legal documents, policies,
          and agreements that govern your use of EKA Balance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/legal/terms"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <FileText className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Terms of Service
          </h3>
          <p className="text-muted-foreground mb-4">
            The agreement between you and EKA Balance regarding your use of our platform and
            services.
          </p>
          <span className="text-primary text-sm font-medium">Read Terms &rarr;</span>
        </Link>

        <Link
          href="/legal/privacy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-success p-3 text-success transition-colors group-hover:bg-success/20">
              <Shield className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Privacy Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Detailed information on how we collect, use, store, and protect your personal data.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/cookies"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-warning p-3 text-warning transition-colors group-hover:bg-warning/20">
              <Cookie className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Cookie Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Explanation of the cookies we use, why we use them, and how you can manage your
            preferences.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/disclaimer"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-destructive/10 p-3 text-destructive transition-colors group-hover:bg-destructive/20">
              <AlertCircle className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Disclaimer
          </h3>
          <p className="text-muted-foreground mb-4">
            Important legal disclaimers regarding medical advice, liability, and professional
            relationships.
          </p>
          <span className="text-primary text-sm font-medium">Read Disclaimer &rarr;</span>
        </Link>

        <Link
          href="/legal/imprint"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-accent p-3 text-accent transition-colors group-hover:bg-accent/20">
              <Building2 className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Legal Notice (Imprint)
          </h3>
          <p className="text-muted-foreground mb-4">
            Company identification data, tax information, and registry details as required by
            Spanish law.
          </p>
          <span className="text-primary text-sm font-medium">Read Notice &rarr;</span>
        </Link>

        <Link
          href="/legal/refund-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Refund Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Information about cancellations, refunds, and your right of withdrawal for our services.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/acceptable-use"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <CheckCircle className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Acceptable Use Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Guidelines on prohibited conduct and how to use our services responsibly and legally.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/accessibility"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-accent/10 p-3 text-accent-foreground transition-colors group-hover:bg-accent/20">
              <Accessibility className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Accessibility Statement
          </h3>
          <p className="text-muted-foreground mb-4">
            Our commitment to ensuring digital accessibility for people with disabilities.
          </p>
          <span className="text-primary text-sm font-medium">Read Statement &rarr;</span>
        </Link>

        <Link
          href="/legal/intellectual-property"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-warning/10 p-3 text-warning transition-colors group-hover:bg-warning/20">
              <Copyright className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Intellectual Property Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Information on copyright, trademarks, and how to report infringement.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/data-processing-agreement"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Database className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Data Processing Agreement
          </h3>
          <p className="text-muted-foreground mb-4">
            Terms governing the processing of personal data under GDPR and other laws.
          </p>
          <span className="text-primary text-sm font-medium">Read Agreement &rarr;</span>
        </Link>

        <Link
          href="/legal/vulnerability-disclosure"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-destructive/20 p-3 text-destructive transition-colors group-hover:bg-destructive/30">
              <Bug className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Vulnerability Disclosure
          </h3>
          <p className="text-muted-foreground mb-4">
            How to report security vulnerabilities and our safe harbor policy for researchers.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/community-guidelines"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-success/20 p-3 text-success-foreground transition-colors group-hover:bg-success/30">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Community Guidelines
          </h3>
          <p className="text-muted-foreground mb-4">
            Rules for maintaining a safe, respectful, and supportive community environment.
          </p>
          <span className="text-primary text-sm font-medium">Read Guidelines &rarr;</span>
        </Link>

        <Link
          href="/legal/modern-slavery-statement"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Scale className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Modern Slavery Statement
          </h3>
          <p className="text-muted-foreground mb-4">
            Our commitment to preventing modern slavery and human trafficking in our supply chain.
          </p>
          <span className="text-primary text-sm font-medium">Read Statement &rarr;</span>
        </Link>

        <Link
          href="/legal/environmental-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-success/20 p-3 text-success-foreground transition-colors group-hover:bg-success/30">
              <Leaf className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Environmental Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Our commitment to sustainability and reducing our environmental impact.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/supplier-code-of-conduct"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-warning/20 p-3 text-warning-foreground transition-colors group-hover:bg-warning/30">
              <Truck className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Supplier Code of Conduct
          </h3>
          <p className="text-muted-foreground mb-4">
            Standards and expectations for our suppliers regarding labor, ethics, and
            sustainability.
          </p>
          <span className="text-primary text-sm font-medium">Read Code &rarr;</span>
        </Link>

        <Link
          href="/legal/anti-bribery-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-destructive/20 p-3 text-destructive transition-colors group-hover:bg-destructive/30">
              <Ban className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Anti-Bribery Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Our zero-tolerance approach to bribery and corruption in all business dealings.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/whistleblower-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Megaphone className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Whistleblower Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Channels and protections for reporting unethical or illegal conduct.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/kyc-aml-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-info/20 p-3 text-info transition-colors group-hover:bg-info/30">
              <Landmark className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            KYC & AML Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Procedures for identity verification and prevention of money laundering.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/dei-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-accent/20 p-3 text-accent-foreground transition-colors group-hover:bg-accent/40">
              <Users className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Diversity, Equity & Inclusion
          </h3>
          <p className="text-muted-foreground mb-4">
            Our commitment to fostering a diverse and inclusive workplace culture.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/social-media-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Share2 className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Social Media Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Guidelines for professional and personal use of social media by employees.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/business-continuity-plan"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Activity className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Business Continuity Plan
          </h3>
          <p className="text-muted-foreground mb-4">
            Strategies to ensure critical business functions continue during disruptions.
          </p>
          <span className="text-primary text-sm font-medium">Read Plan &rarr;</span>
        </Link>

        <Link
          href="/legal/remote-work-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Laptop className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Remote Work Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Guidelines and expectations for employees working remotely.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/service-level-agreement"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <BarChart className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Service Level Agreement
          </h3>
          <p className="text-muted-foreground mb-4">
            Performance commitments and guarantees for our enterprise customers.
          </p>
          <span className="text-primary text-sm font-medium">Read SLA &rarr;</span>
        </Link>

        <Link
          href="/legal/api-terms-of-use"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="bg-muted text-foreground/90 rounded-lg p-3 transition-colors group-hover:bg-muted/80">
              <Code className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            API Terms of Use
          </h3>
          <p className="text-muted-foreground mb-4">
            Terms governing the access and use of our Application Programming Interface.
          </p>
          <span className="text-primary text-sm font-medium">Read Terms &rarr;</span>
        </Link>

        <Link
          href="/legal/affiliate-program-terms"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-warning/20 p-3 text-warning-foreground transition-colors group-hover:bg-warning/30">
              <TrendingUp className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Affiliate Program Terms
          </h3>
          <p className="text-muted-foreground mb-4">
            Conditions for participating in our affiliate marketing program.
          </p>
          <span className="text-primary text-sm font-medium">Read Terms &rarr;</span>
        </Link>

        <Link
          href="/legal/gdpr-compliance"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Globe className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            GDPR Compliance
          </h3>
          <p className="text-muted-foreground mb-4">
            Our commitment to data protection for users in the EEA.
          </p>
          <span className="text-primary text-sm font-medium">Read Statement &rarr;</span>
        </Link>

        <Link
          href="/legal/compliance/ropa"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="bg-muted text-foreground/90 rounded-lg p-3 transition-colors group-hover:bg-muted">
              <FileText className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Record of Processing Activities
          </h3>
          <p className="text-muted-foreground mb-4">
            Overview of our data processing activities as required by Article 30 GDPR.
          </p>
          <span className="text-primary text-sm font-medium">View Records &rarr;</span>
        </Link>

        <Link
          href="/legal/childrens-privacy-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-accent/20 p-3 text-accent-foreground transition-colors group-hover:bg-accent/40">
              <Heart className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Children&apos;s Privacy Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Information regarding the collection of data from children.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/telehealth-consent"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-accent/20 p-3 text-accent-foreground transition-colors group-hover:bg-accent/30">
              <Video className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Telehealth Consent
          </h3>
          <p className="text-muted-foreground mb-4">
            Consent for receiving healthcare services via remote technologies.
          </p>
          <span className="text-primary text-sm font-medium">Read Consent &rarr;</span>
        </Link>

        <Link
          href="/legal/patient-rights"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Scale className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Patient Rights
          </h3>
          <p className="text-muted-foreground mb-4">
            Your rights and responsibilities as a patient at EKA Balance.
          </p>
          <span className="text-primary text-sm font-medium">Read Rights &rarr;</span>
        </Link>

        <Link
          href="/legal/informed-consent"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <FileSignature className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Informed Consent
          </h3>
          <p className="text-muted-foreground mb-4">
            General consent form for treatment and understanding of risks.
          </p>
          <span className="text-primary text-sm font-medium">Read Form &rarr;</span>
        </Link>

        <Link
          href="/legal/code-of-ethics"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-warning/20 p-3 text-warning transition-colors group-hover:bg-warning/30">
              <BookOpen className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Code of Ethics
          </h3>
          <p className="text-muted-foreground mb-4">
            Our commitment to integrity and ethical conduct in all our operations.
          </p>
          <span className="text-primary text-sm font-medium">Read Code &rarr;</span>
        </Link>

        <Link
          href="/legal/workplace-harassment-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-destructive/20 p-3 text-destructive transition-colors group-hover:bg-destructive/30">
              <Ban className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Workplace Harassment Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Zero-tolerance policy for harassment and discrimination.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/employee-privacy-notice"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="bg-muted text-foreground/90 rounded-lg p-3 transition-colors group-hover:bg-muted">
              <UserCog className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Employee Privacy Notice
          </h3>
          <p className="text-muted-foreground mb-4">
            How we handle and protect the personal data of our employees.
          </p>
          <span className="text-primary text-sm font-medium">Read Notice &rarr;</span>
        </Link>

        <Link
          href="/legal/payment-terms"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-success/20 p-3 text-success-foreground transition-colors group-hover:bg-success/30">
              <CreditCard className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Payment Terms
          </h3>
          <p className="text-muted-foreground mb-4">
            Terms governing payments, billing cycles, and fees for our services.
          </p>
          <span className="text-primary text-sm font-medium">Read Terms &rarr;</span>
        </Link>

        <Link
          href="/legal/cancellation-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-destructive/20 p-3 text-destructive transition-colors group-hover:bg-destructive/30">
              <XCircle className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Cancellation Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Rules regarding appointment cancellations, rescheduling, and no-shows.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/insurance-policy"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Umbrella className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Insurance Policy
          </h3>
          <p className="text-muted-foreground mb-4">
            Information on insurance coverage, claims, and liability.
          </p>
          <span className="text-primary text-sm font-medium">Read Policy &rarr;</span>
        </Link>

        <Link
          href="/legal/data-request"
          className="group hover:border-primary/50 bg-card block rounded-lg border-none p-8 transition-all hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              <Database className="h-6 w-6" />
            </div>
            <ArrowRight className="group-hover:text-primary h-5 w-5 text-muted-foreground/50 transition-colors" />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
            Data Rights Request
          </h3>
          <p className="text-muted-foreground mb-4">
            Exercise your rights to access, correct, or delete your personal data.
          </p>
          <span className="text-primary text-sm font-medium">Submit Request &rarr;</span>
        </Link>
      </div>

      <div className="border-t border-b py-12">
        <h2 className="mb-8 text-center text-2xl font-semibold">Compliance & Certifications</h2>
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-3 lg:grid-cols-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-semibold">GDPR Compliant</h3>
            <p className="text-muted-foreground text-xs">EU Data Protection</p>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 mt-12 rounded-lg border-none p-6 text-center">
        <h3 className="mb-2 font-semibold">Questions about our legal policies?</h3>
        <p className="text-muted-foreground mb-4">
          If you have any questions or concerns about these documents, please contact our legal
          team.
        </p>
        <a
          href="mailto:legal@ekabalance.com"
          className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm"
        >
          Contact Legal Team
        </a>
      </div>
    </div>
  );
}
