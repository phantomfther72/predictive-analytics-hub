import { Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-xl font-semibold text-slate-900">
              Predictive Pulse
            </span>
            <p className="mt-4 text-slate-600 max-w-md">
              Empowering financial decisions with AI-driven analytics and real-time
              market insights.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#industries"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Industries
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Connect
            </h3>
            <div className="mt-4 flex space-x-4">
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-center text-slate-600">
            © {new Date().getFullYear()} Predictive Pulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;