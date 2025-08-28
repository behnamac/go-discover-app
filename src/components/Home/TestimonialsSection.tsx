import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useTestimonialData } from "@/hooks/useTestimonialData";

const TestimonialsSection = () => {
  const { testimonials } = useTestimonialData();
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            What Travelers
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {" "}
              Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who've enhanced their travel
            experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-card border-border/40 hover:shadow-card transition-smooth"
            >
              <CardContent className="p-6">
                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <Star
                      key={index}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="text-2xl mr-3">
                    {testimonial.author.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.author.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.author.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
