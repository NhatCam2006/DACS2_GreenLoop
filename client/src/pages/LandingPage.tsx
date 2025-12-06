import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/auth.store";
import { Container } from "../components/layout/Container";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../components/ui/Card";
import {
  Recycle,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Leaf,
  MapPin,
  Camera,
  ArrowRight,
  Star,
  Sparkles,
  Globe,
  Shield,
  Zap,
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
      staggerChildren: 0.1,
    },
  },
};

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// Stats data
const stats = [
  { value: "10K+", label: "Active Users", icon: Users },
  { value: "50K+", label: "kg Recycled", icon: Recycle },
  { value: "1M+", label: "Points Earned", icon: Award },
  { value: "99%", label: "Satisfaction", icon: Star },
];

// How it works steps
const steps = [
  {
    icon: Camera,
    title: "Post Your Recyclables",
    description:
      "Take photos of your items, select the category, and estimate the weight. It only takes a minute!",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: MapPin,
    title: "Get Matched",
    description:
      "Local collectors will see your request and pick it up from your location at your convenience.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Award,
    title: "Earn Rewards",
    description:
      "Collect Green Points based on weight and redeem them for exciting rewards and vouchers!",
    color: "from-purple-500 to-pink-600",
  },
];

// Features data
const features = [
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description:
      "Help reduce waste and protect our environment for future generations.",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Award,
    title: "Rewarding",
    description:
      "Earn points for every donation and exchange them for vouchers and gifts.",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join thousands of users making a positive impact together.",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Transparent",
    description: "Track your impact with detailed statistics and reports.",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

// Testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Active Donor",
    content:
      "GreenLoop made recycling so easy! I've earned over 5000 points and redeemed amazing rewards.",
    avatar: "👩",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Collector",
    content:
      "As a collector, this platform helps me find recyclables efficiently. Great for my business!",
    avatar: "👨",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Eco Enthusiast",
    content:
      "Finally, a platform that rewards you for doing good. The community here is amazing!",
    avatar: "👩‍🦰",
    rating: 5,
  },
];

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuthStore();

  const getDonationLink = () => {
    if (!isAuthenticated) return "/register";
    if (user?.role === "DONOR") return "/donor/new-donation";
    if (user?.role === "COLLECTOR") return "/collector/available";
    return "/admin/dashboard";
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 dark:bg-green-900 rounded-full opacity-30 blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 dark:bg-emerald-900 rounded-full opacity-30 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-full opacity-20 blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 rounded-full text-green-700 dark:text-green-300 font-medium text-sm mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>#1 Recycling Platform in Vietnam</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Turn Your Trash
                <br />
                <span className="gradient-text">into Treasure</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg leading-relaxed">
                Join GreenLoop - the platform connecting donors and collectors.
                Make recycling rewarding with our points-based system.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to={getDonationLink()}>
                  <Button
                    size="xl"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    {isAuthenticated ? "Donate Now" : "Start Donating"}
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/register">
                    <Button variant="outline" size="xl">
                      Become a Collector
                    </Button>
                  </Link>
                )}
              </div>

              {/* Stats row */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-4 gap-6"
              >
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={fadeInUp}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right illustration */}
            <motion.div
              className="hidden lg:block relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Main card */}
                <motion.div
                  className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl dark:shadow-slate-900/50 p-8 z-10"
                  variants={floatAnimation}
                  initial="initial"
                  animate="animate"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <Recycle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      2,547
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Points Earned Today
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 p-4 z-20"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        +250 pts
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        New donation
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 p-4 z-20"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Reward!
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Voucher unlocked
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative circles */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-green-200/50 to-emerald-200/50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </Container>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-white dark:fill-slate-900"
          >
            <path d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" />
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/40 rounded-full text-green-700 dark:text-green-300 font-medium text-sm mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Three simple steps to start making a difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 dark:from-slate-700 to-transparent" />
                )}

                <div className="text-center group">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  <div className="w-10 h-10 bg-gray-900 dark:bg-slate-700 text-white text-lg font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Why Choose GreenLoop?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We make recycling easy, rewarding, and impactful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover glow className="h-full">
                  <CardContent className="pt-6">
                    <div
                      className={`w-14 h-14 ${feature.color} dark:opacity-80 rounded-2xl flex items-center justify-center mb-4`}
                    >
                      <feature.icon
                        className={`w-7 h-7 ${feature.iconColor}`}
                      />
                    </div>
                    <CardTitle className="text-lg mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-700 dark:text-purple-300 font-medium text-sm mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card variant="bordered" className="h-full">
                  <CardContent className="pt-6">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        )
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 border-4 border-white rounded-full" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6"
            >
              <Globe className="w-4 h-4" />
              <span>Join 10,000+ eco-warriors</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl opacity-90 mb-10">
              Join GreenLoop today and start your journey towards a greener
              planet. Every action counts!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={getDonationLink()}>
                <Button
                  size="xl"
                  className="bg-white text-green-600 hover:bg-gray-100 shadow-xl"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {isAuthenticated ? "Donate Now" : "Get Started Free"}
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 opacity-80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Fast Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Verified Collectors</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/40 rounded-full text-green-700 dark:text-green-300 font-medium text-sm mb-4">
                Our Impact
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Every Donation Counts
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Your small action creates a big impact. Together, we can build a
                sustainable future for generations to come.
              </p>

              <ul className="space-y-4">
                {[
                  "Reduce landfill waste by up to 70%",
                  "Support local recycling economy",
                  "Earn rewards while helping the planet",
                  "Track your environmental impact in real-time",
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/30 rounded-3xl p-10 text-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-green-200/50 dark:bg-green-800/30 rounded-full blur-xl" />
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-teal-200/50 dark:bg-teal-800/30 rounded-full blur-xl" />

                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-8xl mb-6"
                >
                  🌍
                </motion.div>

                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                  Join the Green Revolution
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Be part of the solution, not the pollution
                </p>

                <Link to={getDonationLink()}>
                  <Button
                    size="lg"
                    variant="gradient"
                    rightIcon={<Sparkles className="w-5 h-5" />}
                  >
                    {isAuthenticated ? "Donate Now" : "Sign Up Free"}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
};
