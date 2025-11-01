import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [cursorVariant, setCursorVariant] = useState("default");
  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);

      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
          setIsVisible((prev) => ({ ...prev, [index]: isInView }));
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const features = [
    {
      title: "SMART TRACKING",
      description:
        "AI-powered progress tracking with detailed analytics and personalized insights",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-12 h-12 md:w-16 md:h-16"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="3" y="12" width="3.5" height="8" rx="0.5" />
          <rect x="9" y="8" width="3.5" height="12" rx="0.5" />
          <rect x="15" y="4" width="3.5" height="16" rx="0.5" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "REAL-TIME COLLAB",
      description: "Work together seamlessly with live editing and instant synchronization",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-12 h-12 md:w-16 md:h-16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M4 20a4 4 0 014-4h8a4 4 0 014 4v1H4v-1z" />
          <path d="M18 8a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "PROJECT PORTFOLIO",
      description: "Showcase your work with beautiful templates and custom domains",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-12 h-12 md:w-16 md:h-16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 21l21-9L11 2 2 21z" />
          <circle cx="7.5" cy="14.5" r="1.5" fill="#fff" />
        </svg>
      ),
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "PRODUCTIVITY BOOST",
      description: "Smart reminders, time tracking, and focus modes to maximize efficiency",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-12 h-12 md:w-16 md:h-16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      ),
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const detailedFeatures = [
    {
      title: "Advanced Analytics",
      description: "Deep insights into your learning patterns, time spent, and progress over time with beautiful visualizations.",
      stats: "10+ Metrics",
    },
    {
      title: "Cloud Storage",
      description: "Never lose your work. Automatic backups with unlimited storage for all your projects and documents.",
      stats: "Unlimited GB",
    },
    {
      title: "Team Workspace",
      description: "Create dedicated spaces for your team with role-based permissions and collaborative tools.",
      stats: "Up to 50 Members",
    },
    {
      title: "API Integration",
      description: "Connect with your favorite tools through our robust API and webhook system.",
      stats: "100+ Apps",
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team is always available to help you succeed.",
      stats: "< 1 Hour Response",
    },
    {
      title: "Custom Branding",
      description: "White-label solution with custom domains, logos, and color schemes.",
      stats: "Full Control",
    },
  ];

  const pricingPlans = [
    {
      name: "STARTER",
      price: "FREE",
      period: "forever",
      description: "Perfect for students getting started",
      features: [
        "5 Projects",
        "Basic Analytics",
        "Community Support",
        "2GB Storage",
        "Mobile App Access",
      ],
      cta: "START FREE",
      popular: false,
    },
    {
      name: "PRO",
      price: "$9",
      period: "per month",
      description: "For serious project makers",
      features: [
        "Unlimited Projects",
        "Advanced Analytics",
        "Priority Support",
        "50GB Storage",
        "Team Collaboration (5)",
        "Custom Domain",
        "API Access",
      ],
      cta: "GO PRO",
      popular: true,
    },
    {
      name: "ENTERPRISE",
      price: "$29",
      period: "per month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Unlimited Team Members",
        "Unlimited Storage",
        "Dedicated Support",
        "Custom Integrations",
        "White Label",
        "Advanced Security",
      ],
      cta: "CONTACT SALES",
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "This platform transformed how I manage my projects. The analytics are incredible!",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Full Stack Developer",
      content: "Best tool for tracking multiple projects. The collaboration features are game-changing.",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Designer",
      content: "Clean, intuitive, and powerful. Everything I need in one place.",
      avatar: "ER",
    },
  ];

  return (
    <div className="relative bg-white overflow-x-hidden">
      {/* Custom Cursor */}
      <div
        className={`fixed w-6 h-6 border-2 border-black rounded-full pointer-events-none z-50 mix-blend-difference transition-all duration-100 ${cursorVariant === "hover" ? "scale-150 bg-black" : ""
          }`}
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter">LOGO</div>
          <div className="hidden md:flex gap-8 font-bold text-sm tracking-wider">
            <a href="#features" className="hover:opacity-50 transition-opacity duration-100">FEATURES</a>
            <a href="#pricing" className="hover:opacity-50 transition-opacity duration-100">PRICING</a>
            <a href="#testimonials" className="hover:opacity-50 transition-opacity duration-100">REVIEWS</a>
          </div>
          <Link to="/login">
            <button className="px-6 py-2 bg-black text-white font-bold text-sm tracking-wider hover:scale-105 transition-transform duration-150">
              LOGIN
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="h-full w-full bg-[linear-gradient(black_2px,transparent_2px),linear-gradient(90deg,black_2px,transparent_2px)] bg-[size:100px_100px]" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute border-2 border-black/5"
              style={{
                width: `${50 + i * 30}px`,
                height: `${50 + i * 30}px`,
                left: `${(i * 23) % 100}%`,
                top: `${(i * 17) % 100}%`,
                animation: `float-random ${8 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                transform: `rotate(${i * 15}deg) translateY(${scrollY * (i % 3) * 0.1}px)`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          <div className="mb-12 overflow-hidden">
            <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none mb-4">
              {["BUILD", "LEARN", "GROW"].map((word, i) => (
                <div
                  key={word}
                  className="inline-block animate-slide-up"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationFillMode: "both",
                  }}
                >
                  {word}
                  {i < 2 && <span className="mx-4">•</span>}
                </div>
              ))}
            </h1>
          </div>

          <p
            className="text-xl md:text-3xl text-black/60 mb-16 max-w-3xl mx-auto font-light animate-fade-in"
            style={{ animationDelay: "0.8s", animationFillMode: "both" }}
          >
            The ultimate platform for students and project makers to track, collaborate, and succeed
          </p>

          <div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in"
            style={{ animationDelay: "1s", animationFillMode: "both" }}
          >
            <Link to="/register">
              <button className="group relative px-12 py-6 bg-black text-white font-bold text-lg tracking-wider uppercase overflow-hidden hover:scale-105 active:scale-95 transition-all duration-200">
                <span className="relative z-10">GET STARTED</span>
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  GET STARTED →
                </span>
              </button>
            </Link>

            <a href="#features">
              <button className="group px-12 py-6 border-2 border-black bg-white text-black font-bold text-lg tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-200">
                LEARN MORE
              </button>
            </a>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-black rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-black rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section
        id="features"
        ref={(el) => (sectionRefs.current[0] = el)}
        className="relative py-32 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-6xl md:text-8xl font-black text-center mb-20 transition-all duration-1000 ${isVisible[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
          >
            WHAT WE OFFER
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
                className={`group relative bg-white border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer ${isVisible[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  }`}
                style={{
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-200">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-black mb-4 tracking-tight">
                  {feature.title}
                </h3>

                <p className="text-black/60 group-hover:text-white/80 transition-colors duration-200">
                  {feature.description}
                </p>

                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-black group-hover:border-white opacity-0 group-hover:opacity-100 transition-all duration-150" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-black group-hover:border-white opacity-0 group-hover:opacity-100 transition-all duration-150" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-black group-hover:border-white opacity-0 group-hover:opacity-100 transition-all duration-150" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-black group-hover:border-white opacity-0 group-hover:opacity-100 transition-all duration-150" />
              </div>
            ))}
          </div>

          {/* Detailed Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedFeatures.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 border-2 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${isVisible[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  }`}
                style={{ transitionDelay: `${index * 0.1 + 0.5}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black">{feature.title}</h3>
                  <span className="text-xs font-mono bg-black text-white px-2 py-1">
                    {feature.stats}
                  </span>
                </div>
                <p className="text-black/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        ref={(el) => (sectionRefs.current[1] = el)}
        className="relative py-32 px-6 bg-black text-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-6xl md:text-8xl font-black text-center mb-8 transition-all duration-1000 ${isVisible[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
          >
            PRICING
          </h2>
          <p
            className={`text-xl text-white/60 text-center mb-20 transition-all duration-1000 delay-200 ${isVisible[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
          >
            Choose the plan that fits your needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 border-2 ${plan.popular
                  ? "border-white bg-white text-black scale-105"
                  : "border-white/30 bg-black hover:border-white"
                  } transition-all duration-300 ${isVisible[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 text-xs font-black tracking-widest">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-3xl font-black mb-2">{plan.name}</h3>
                  <p className={plan.popular ? "text-black/60" : "text-white/60"}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="text-6xl font-black mb-2">{plan.price}</div>
                  <div className={`text-sm ${plan.popular ? "text-black/60" : "text-white/60"}`}>
                    {plan.period}
                  </div>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-xl">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register">
                  <button
                    className={`w-full py-4 font-black tracking-wider transition-all duration-200 ${plan.popular
                      ? "bg-black text-white hover:bg-black/90"
                      : "bg-white text-black hover:bg-white/90"
                      }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        ref={(el) => (sectionRefs.current[2] = el)}
        className="relative py-32 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-6xl md:text-8xl font-black text-center mb-20 transition-all duration-1000 ${isVisible[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
          >
            WHAT THEY SAY
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-8 border-2 border-black hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${isVisible[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-black text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-black">{testimonial.name}</div>
                    <div className="text-sm text-black/60">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-lg leading-relaxed">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={(el) => (sectionRefs.current[3] = el)}
        className="relative py-32 bg-black text-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { number: "10K+", label: "Active Students" },
              { number: "5K+", label: "Projects Built" },
              { number: "98%", label: "Success Rate" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-1000 ${isVisible[3] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="text-7xl md:text-8xl font-black mb-4 tracking-tighter">
                  {stat.number}
                </div>
                <div className="text-lg text-white/60 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={(el) => (sectionRefs.current[4] = el)}
        className="relative py-32 px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className={`text-6xl md:text-9xl font-black mb-12 leading-none transition-all duration-1000 ${isVisible[4] ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
          >
            READY TO
            <br />
            START?
          </h2>

          <p
            className={`text-2xl text-black/60 mb-16 transition-all duration-1000 delay-200 ${isVisible[4] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            Join thousands of students and creators building their future
          </p>

          <Link to="/register">
            <button
              className={`group relative px-20 py-8 bg-black text-white font-black text-2xl tracking-wider uppercase overflow-hidden hover:scale-105 active:scale-95 transition-all duration-200 ${isVisible[4] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              style={{ transitionDelay: "400ms" }}
            >
              <span className="relative z-10 flex items-center gap-4">
                JOIN NOW
                <svg
                  className="w-8 h-8 transform group-hover:translate-x-2 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>

              <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 transition-all duration-200" />
            </button>
          </Link>
        </div>
      </section>

      {/* Epic Footer */}
      <footer className="relative bg-black text-white border-t-2 border-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="text-4xl font-black mb-4 tracking-tighter">LOGO</div>
              <p className="text-white/60 mb-6">
                Empowering students and creators to build the future.
              </p>
              <div className="flex gap-4">
                {["TW", "IG", "LI", "GH"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-12 h-12 border-2 border-white/30 flex items-center justify-center font-black hover:bg-white hover:text-black transition-all duration-150"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-xl font-black mb-6 tracking-wider">PRODUCT</h3>
              <ul className="space-y-3 text-white/60">
                <li><a href="#features" className="hover:text-white transition-colors duration-150">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors duration-150">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Roadmap</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xl font-black mb-6 tracking-wider">COMPANY</h3>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors duration-150">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xl font-black mb-6 tracking-wider">LEGAL</h3>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors duration-150">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Cookies</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-150">Licenses</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm font-mono">
              © 2025 LOGO. All rights reserved. Designed by Abhinav6284
            </p>
            <div className="flex gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors duration-150">Status</a>
              <a href="#" className="hover:text-white transition-colors duration-150">Changelog</a>
              <a href="#" className="hover:text-white transition-colors duration-150">Documentation</a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-white/10" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-white/10" />
      </footer>
    </div>
  );
}