import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/auth.store";
import { Container } from "../components/layout/Container";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import {
  Camera,
  MapPin,
  Award,
  Recycle,
  Truck,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Gift,
  Users,
  Leaf,
  Shield,
  Star,
  Package,
  CreditCard,
  Bell,
  ThumbsUp,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Donor Steps
const donorSteps = [
  {
    step: 1,
    icon: Camera,
    title: "Create a Donation",
    description:
      "Take photos of your recyclable items, select the waste category (plastic, paper, metal, etc.), and estimate the weight.",
    color: "from-green-500 to-emerald-600",
    details: [
      "Upload clear photos of items",
      "Choose from multiple categories",
      "Set your preferred pickup time",
    ],
  },
  {
    step: 2,
    icon: MapPin,
    title: "Set Your Location",
    description:
      "Add your pickup address or select from saved locations. Our collectors will come right to your doorstep.",
    color: "from-blue-500 to-indigo-600",
    details: [
      "Save multiple addresses",
      "Real-time location tracking",
      "Flexible pickup scheduling",
    ],
  },
  {
    step: 3,
    icon: Bell,
    title: "Get Matched",
    description:
      "Nearby collectors will see your request and accept it. You'll receive notifications about the collection status.",
    color: "from-purple-500 to-pink-600",
    details: [
      "Instant notifications",
      "View collector profiles",
      "Track collection progress",
    ],
  },
  {
    step: 4,
    icon: Award,
    title: "Earn Rewards",
    description:
      "After successful collection, earn Green Points based on the weight and type of materials. Redeem for exciting rewards!",
    color: "from-yellow-500 to-orange-600",
    details: [
      "Points based on weight",
      "Bonus for certain materials",
      "Redeem for vouchers & gifts",
    ],
  },
];

// Collector Steps
const collectorSteps = [
  {
    step: 1,
    icon: Smartphone,
    title: "Browse Requests",
    description:
      "View available donation requests in your area. Filter by location, material type, and estimated quantity.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    step: 2,
    icon: ThumbsUp,
    title: "Accept & Collect",
    description:
      "Accept requests that match your route. Navigate to the donor's location and collect the recyclables.",
    color: "from-green-500 to-teal-600",
  },
  {
    step: 3,
    icon: Package,
    title: "Verify & Complete",
    description:
      "Weigh the collected items, verify the materials, and mark the collection as complete.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    step: 4,
    icon: CreditCard,
    title: "Get Paid",
    description:
      "Receive payment for your collection services. Build your reputation with positive reviews.",
    color: "from-pink-500 to-rose-600",
  },
];

// Benefits
const benefits = [
  {
    icon: Leaf,
    title: "Environmental Impact",
    description:
      "Every kg recycled reduces landfill waste and carbon emissions.",
    stat: "50K+ kg",
    statLabel: "Recycled",
  },
  {
    icon: Users,
    title: "Growing Community",
    description:
      "Join thousands of eco-conscious individuals making a difference.",
    stat: "10K+",
    statLabel: "Active Users",
  },
  {
    icon: Gift,
    title: "Valuable Rewards",
    description: "Earn points and redeem them for real rewards and discounts.",
    stat: "1M+",
    statLabel: "Points Awarded",
  },
  {
    icon: Shield,
    title: "Trusted & Secure",
    description:
      "Verified collectors and secure transactions for peace of mind.",
    stat: "99%",
    statLabel: "Satisfaction",
  },
];

// FAQ
const faqs = [
  {
    question: "What materials can I donate?",
    answer:
      "We accept various recyclable materials including plastic bottles, paper, cardboard, metal cans, glass, and electronic waste. Check the categories in our app for the full list.",
  },
  {
    question: "How are points calculated?",
    answer:
      "Points are calculated based on the weight of materials and their type. Different materials have different point values. Bonus points may be awarded for large donations or special campaigns.",
  },
  {
    question: "How long does collection take?",
    answer:
      "Most collections happen within 24-48 hours of posting. You can also schedule a specific time that works for you. Collectors in your area will pick up at your convenience.",
  },
  {
    question: "How do I become a collector?",
    answer:
      "Sign up as a collector, verify your identity, and start accepting requests! You'll need a valid ID and transportation means. Training materials are provided to help you get started.",
  },
  {
    question: "What rewards can I redeem?",
    answer:
      "Our reward catalog includes shopping vouchers, food discounts, eco-friendly products, and charity donations. New rewards are added regularly!",
  },
  {
    question: "Is there a minimum weight for donations?",
    answer:
      "There's no strict minimum, but we recommend at least 1kg for efficient collection. Smaller amounts can be saved until you have more items to donate.",
  },
];

export const HowItWorksPage = () => {
  const { isAuthenticated, user } = useAuthStore();

  const getDashboardLink = () => {
    if (!isAuthenticated) return "/register";
    if (user?.role === "ADMIN") return "/admin/dashboard";
    if (user?.role === "COLLECTOR") return "/collector/dashboard";
    return "/donor/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 dark:bg-green-900 rounded-full opacity-30 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 dark:bg-emerald-900 rounded-full opacity-30 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 rounded-full text-green-700 dark:text-green-300 font-medium text-sm mb-6"
            >
              <Recycle className="w-4 h-4" />
              Simple & Rewarding
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                GreenLoop
              </span>{" "}
              Works
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Turn your recyclables into rewards in just a few simple steps.
              Whether you're a donor or collector, we make recycling easy and
              rewarding for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={getDashboardLink()}>
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Recycling"}
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Become a Collector
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* For Donors Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 rounded-full text-green-700 dark:text-green-300 font-medium text-sm mb-4">
              <Recycle className="w-4 h-4" />
              For Donors
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Donate Your Recyclables
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Four simple steps to turn your waste into rewards
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-32 left-[10%] right-[10%] h-1 bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-yellow-500 rounded-full opacity-20" />

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {donorSteps.map((step) => (
                <motion.div
                  key={step.step}
                  variants={fadeInUp}
                  className="relative"
                >
                  <Card hover className="h-full">
                    <CardContent className="p-6">
                      {/* Step number */}
                      <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                        {step.step}
                      </div>

                      {/* Icon */}
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </motion.div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {step.description}
                      </p>

                      {/* Details */}
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* For Collectors Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
              <Truck className="w-4 h-4" />
              For Collectors
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Collect & Earn
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Turn recyclable collection into a rewarding business
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {collectorSteps.map((step) => (
              <motion.div key={step.step} variants={fadeInUp}>
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700">
                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-gray-200 dark:text-slate-700">
                      0{step.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-700 dark:text-purple-300 font-medium text-sm mb-4">
              <Star className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Benefits for Everyone
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover glow className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {benefit.stat}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-3">
                      {benefit.statLabel}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/40 rounded-full text-orange-700 dark:text-orange-300 font-medium text-sm mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 dark:text-green-400 text-sm font-bold">
                        ?
                      </span>
                    </span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 ml-9">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-white rounded-full" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join GreenLoop today and start your journey towards a greener
              planet. Every action counts!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={getDashboardLink()}>
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 shadow-xl"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};
