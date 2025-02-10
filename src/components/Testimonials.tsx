
const testimonials = [
  {
    content:
      "Predictive Pulse has transformed how we analyze market trends in Namibia. The uranium mining insights have been particularly valuable for our investment decisions.",
    author: "Johannes Shikongo",
    role: "Mining Operations Director",
    company: "Namibia Mining Solutions",
  },
  {
    content:
      "The real-time tracking of the Namibian housing market across different regions has given us a competitive edge. An essential tool for our property consultancy.",
    author: "Maria Nangolo",
    role: "Property Market Analyst",
    company: "Windhoek Real Estate Group",
  },
  {
    content:
      "As an agricultural business owner, the platform's insights into cattle farming metrics and crop production have significantly improved our strategic planning.",
    author: "Daniel !Gases",
    role: "Agricultural Economist",
    company: "Namibia Agri Consulting",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Trusted by Namibian Industry Leaders
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
