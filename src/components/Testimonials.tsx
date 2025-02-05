const testimonials = [
  {
    content:
      "Predictive Pulse has transformed how we analyze market trends. The AI-driven insights have been invaluable for our investment strategy.",
    author: "Sarah Chen",
    role: "Investment Director",
    company: "Global Ventures",
  },
  {
    content:
      "The cross-sector analytics have given us a competitive edge in identifying market opportunities. An essential tool for modern finance.",
    author: "Michael Rodriguez",
    role: "Market Analyst",
    company: "Market Insights Co",
  },
  {
    content:
      "The platform's real-time tracking capabilities have significantly improved our decision-making process. Highly recommended.",
    author: "David Park",
    role: "Portfolio Manager",
    company: "Asset Management Ltd",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Trusted by Industry Leaders
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            See what our clients say about Predictive Pulse
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-slate-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {testimonial.role}
                    <br />
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;