'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Database, Cpu, BarChart3, MessageSquare } from 'lucide-react';

const HowItWorks = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const steps = [
    {
      icon: Database,
      title: "Data Integration",
      description: "Connect your HR systems and import employee data into our secure PostgreSQL database.",
      step: "01"
    },
    {
      icon: Cpu,
      title: "AI Processing",
      description: "Our machine learning models analyze patterns and predict attrition risk factors.",
      step: "02"
    },
    {
      icon: BarChart3,
      title: "Insight Generation",
      description: "Get actionable insights through interactive dashboards and detailed reports.",
      step: "03"
    },
    {
      icon: MessageSquare,
      title: "Chat Interface",
      description: "Ask questions and get instant answers using our AI-powered RAG chatbot.",
      step: "04"
    }
  ];

  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-primary-50">
      <div className="container-custom section-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It <span className="text-primary-600">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, secure, and powerful - transform your HR operations in four easy steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-200 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center group"
              >
                <div className="relative z-10 bg-white rounded-2xl p-8 border border-gray-200 group-hover:border-primary-300 transition-all duration-300 group-hover:shadow-lg">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="text-white text-sm font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;