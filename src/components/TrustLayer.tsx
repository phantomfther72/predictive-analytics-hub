
import React from 'react';
import { Shield, Award, Users, Zap, Star, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TrustLayer = () => {
  const testimonials = [
    {
      quote: "Predictive Pulse's AI insights have transformed our investment strategy. The Namibian market analysis is unmatched.",
      author: "Dr. Sarah Mumbala",
      role: "Portfolio Manager",
      company: "Namibia Asset Management",
      avatar: "SM"
    },
    {
      quote: "Finally, an investment platform that understands the African market dynamics. The oil & gas predictions have been incredibly accurate.",
      author: "Johannes Nghidinwa",
      role: "Investment Director",
      company: "Windhoek Capital Partners",
      avatar: "JN"
    },
    {
      quote: "The AI-powered fund builder is revolutionary. I created a diversified portfolio in minutes that would have taken weeks with traditional methods.",
      author: "Maria Santos",
      role: "Independent Investor",
      company: "Tech Entrepreneur",
      avatar: "MS"
    }
  ];

  const partnerships = [
    { name: "TotalEnergies", badge: "Startup Challenge Top 100", logo: "TE" },
    { name: "Lovable", badge: "Technology Partner", logo: "LV" },
    { name: "Namibia Stock Exchange", badge: "Data Provider", logo: "NSX" },
    { name: "Bank Windhoek", badge: "Financial Partner", logo: "BW" }
  ];

  const certifications = [
    { icon: <Shield className="h-6 w-6" />, title: "Bank-Grade Security", description: "256-bit encryption" },
    { icon: <Award className="h-6 w-6" />, title: "FSC Compliant", description: "Regulated operations" },
    { icon: <Users className="h-6 w-6" />, title: "ISO 27001", description: "Data protection certified" },
    { icon: <Zap className="h-6 w-6" />, title: "99.9% Uptime", description: "Enterprise reliability" }
  ];

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Trusted by <span className="text-green-400">Namibia's Leading</span> Investors
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join the investment revolution backed by industry leaders, cutting-edge security, and proven results.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-slate-300 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full flex items-center justify-center text-black font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.author}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                    <div className="text-sm text-green-400">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnerships */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Strategic Partnerships
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partnerships.map((partner, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-400 font-bold text-lg">{partner.logo}</span>
                </div>
                <div className="text-white font-medium mb-1">{partner.name}</div>
                <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                  {partner.badge}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {certifications.map((cert, index) => (
            <div key={index} className="text-center p-6 bg-slate-800/30 border border-slate-700 rounded-2xl">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-400">
                {cert.icon}
              </div>
              <h4 className="text-white font-bold mb-2">{cert.title}</h4>
              <p className="text-slate-400 text-sm">{cert.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">500+</div>
            <div className="text-slate-300">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">N$2.5M+</div>
            <div className="text-slate-300">Assets Under Management</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">94%</div>
            <div className="text-slate-300">Prediction Accuracy</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustLayer;
