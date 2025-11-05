'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-primary-900">
      <div className="container-custom section-padding">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Ready to Transform Your{" "}
            <span className="text-primary-200">HR Analytics?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
          >
            Join forward-thinking companies that use AI to reduce attrition and build happier, more productive teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button className="bg-white text-primary-900 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-primary-300 text-white hover:bg-primary-800 font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-primary-900">
              Schedule Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-white"
          >
            {[
              {
                icon: Shield,
                text: "Enterprise Security"
              },
              {
                icon: Zap,
                text: "Setup in 5 Minutes"
              },
              {
                icon: Users,
                text: "24/7 Support"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-3">
                <item.icon className="w-5 h-5 text-primary-200" />
                <span className="text-primary-100 font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;