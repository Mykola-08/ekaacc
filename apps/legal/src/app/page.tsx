import Link from "next/link";
import { Shield, FileText, Cookie, AlertCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Legal Center</h1>
        <p className="text-lg text-gray-600">
          Transparency is core to our values. Here you can find all the legal documents, policies, and agreements that govern your use of EKA Balance.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/terms" className="group block p-8 border rounded-xl hover:border-primary/50 hover:shadow-md transition-all bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Terms of Service</h3>
          <p className="text-gray-600 mb-4">The agreement between you and EKA Balance regarding your use of our platform and services.</p>
          <span className="text-sm font-medium text-primary">Read Terms &rarr;</span>
        </Link>
        
        <Link href="/privacy" className="group block p-8 border rounded-xl hover:border-primary/50 hover:shadow-md transition-all bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Privacy Policy</h3>
          <p className="text-gray-600 mb-4">Detailed information on how we collect, use, store, and protect your personal data.</p>
          <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
        </Link>
        
        <Link href="/cookies" className="group block p-8 border rounded-xl hover:border-primary/50 hover:shadow-md transition-all bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-100 transition-colors">
              <Cookie className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Cookie Policy</h3>
          <p className="text-gray-600 mb-4">Explanation of the cookies we use, why we use them, and how you can manage your preferences.</p>
          <span className="text-sm font-medium text-primary">Read Policy &rarr;</span>
        </Link>
        
        <Link href="/disclaimer" className="group block p-8 border rounded-xl hover:border-primary/50 hover:shadow-md transition-all bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg text-red-600 group-hover:bg-red-100 transition-colors">
              <AlertCircle className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Disclaimer</h3>
          <p className="text-gray-600 mb-4">Important legal disclaimers regarding medical advice, liability, and professional relationships.</p>
          <span className="text-sm font-medium text-primary">Read Disclaimer &rarr;</span>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg border text-center">
        <h3 className="font-semibold mb-2">Questions about our legal policies?</h3>
        <p className="text-gray-600 mb-4">
          If you have any questions or concerns about these documents, please contact our legal team.
        </p>
        <a href="mailto:legal@ekabalance.com" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 shadow-sm">
          Contact Legal Team
        </a>
      </div>
    </div>
  );
}
