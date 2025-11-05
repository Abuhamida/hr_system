'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Database,
  Zap
} from 'lucide-react';

const Features = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const features = [
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Advanced ML models identify employees at risk of leaving with 95% accuracy, allowing proactive retention strategies.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Users,
      title: "Employee Insights",
      description: "Comprehensive profiles with performance data, skill mapping, and career progression tracking.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Get instant answers to HR questions using RAG technology powered by your company documents.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: ShieldCheck,
      title: "Role-based Security",
      description: "Enterprise-grade security with granular access controls for HR, managers, and employees.",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Database,
      title: "Centralized Data",
      description: "Unified database schema integrating all HR functions from hiring to retirement.",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Zap,
      title: "Real-time Alerts",
      description: "Instant notifications for critical events like high attrition risk or compliance issues.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container-custom section-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for{" "}
            <span className="text-primary-600">Modern HR Teams</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to transform your HR operations with data-driven insights and AI-powered tools.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl"
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;