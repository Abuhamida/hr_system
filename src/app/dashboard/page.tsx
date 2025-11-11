"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserX,
  AlertTriangle,
  Smile,
  BarChart3,
  TrendingUp,
  Award,
  Loader2,
} from "lucide-react";
import type { Employee } from "@/lib/types";
import KpiCard from "./components/KpiCard";
import AttritionByDeptChart from "./components/charts/AttritionByDeptChart";
import JobSatisfactionChart from "./components/charts/JobSatisfactionChart";
import PerformanceRatingChart from "./components/charts/PerformanceRatingChart";
import { createClient } from "@/lib/supabase/client";
const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      try {
        // Get employees list
        const employeesRes = await fetch("/api/employees");
        const employeesData = await employeesRes.json();
        setEmployees(employeesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const { kpiData, chartData } = useMemo(() => {
    // Safe check for employees array
    if (!employees || employees.length === 0) {
      return {
        kpiData: {
          totalEmployees: 0,
          attritionCount: 0,
          highRiskCount: 0,
          avgJobSatisfaction: "0.0",
        },
        chartData: {
          attritionByDeptData: [],
          jobSatisfactionData: [],
          performanceRatingData: [],
        },
      };
    }

    const totalEmployees = employees.length;
    const attritionCount = employees.filter((e) => e.attrition).length;
    const highRiskCount = employees.filter(
      (e) => !e.attrition && (e.job_satisfaction || 0) <= 2
    ).length;
    const avgJobSatisfaction = (
      employees.reduce((acc, e) => acc + (e.job_satisfaction || 0), 0) /
      totalEmployees
    ).toFixed(1);

    const kpiData = {
      totalEmployees,
      attritionCount,
      highRiskCount,
      avgJobSatisfaction,
    };

    const departmentStats: {
      [key: string]: { Total: number; Attrition: number };
    } = {};
    const jobSatisfaction: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };
    const performanceRating: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };

    employees.forEach((emp) => {
      const dept = emp.department || "Unknown";
      if (!departmentStats[dept]) {
        departmentStats[dept] = { Total: 0, Attrition: 0 };
      }
      departmentStats[dept].Total++;

      if (emp.attrition) {
        departmentStats[dept].Attrition++;
      }

      jobSatisfaction[emp.job_satisfaction || 1]++;
      performanceRating[emp.performance_rating || 1]++;
    });

    const attritionByDeptData = Object.keys(departmentStats).map((name) => ({
      name,
      Total: departmentStats[name].Total,
      Attrition: departmentStats[name].Attrition,
    }));

    const jobSatisfactionData = Object.keys(jobSatisfaction).map((key) => ({
      name: `Level ${key}`,
      count: jobSatisfaction[Number(key)],
    }));

    const performanceRatingData = Object.keys(performanceRating).map((key) => ({
      name: `Rating ${key}`,
      count: performanceRating[Number(key)],
    }));

    return {
      kpiData,
      chartData: {
        attritionByDeptData,
        jobSatisfactionData,
        performanceRatingData,
      },
    };
  }, [employees]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
       <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading dashboard...</p>
          </div>
        </div>
    );
  }

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-linear-to-br from-primary-50/30 via-white to-secondary-50/30">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          HR Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time insights into your workforce metrics and performance
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <KpiCard
            title="Total Employees"
            value={kpiData.totalEmployees}
            subtitle="Current workforce"
            icon={<Users className="w-6 h-6" />}
            trend="stable"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            title="Attrition Count"
            value={kpiData.attritionCount}
            subtitle="Employees who left"
            icon={<UserX className="w-6 h-6" />}
            trend="down"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            title="High-Risk Employees"
            value={kpiData.highRiskCount}
            subtitle="Based on low satisfaction"
            icon={<AlertTriangle className="w-6 h-6" />}
            trend="up"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            title="Avg. Job Satisfaction"
            value={`${kpiData.avgJobSatisfaction} / 4`}
            subtitle="Overall employee morale"
            icon={<Smile className="w-6 h-6" />}
            trend="up"
          />
        </motion.div>
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
      >
        {/* Job Satisfaction Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Job Satisfaction Breakdown
              </h3>
              <p className="text-sm text-gray-600">
                Distribution across satisfaction levels
              </p>
            </div>
          </div>
          <JobSatisfactionChart data={chartData.jobSatisfactionData} />
        </motion.div>

        {/* Performance Rating Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Rating Distribution
              </h3>
              <p className="text-sm text-gray-600">
                Employee performance overview
              </p>
            </div>
          </div>
          <PerformanceRatingChart data={chartData.performanceRatingData} />
        </motion.div>

        {/* Attrition by Department - Full Width */}
        <motion.div
          variants={itemVariants}
          className="xl:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Attrition by Department
              </h3>
              <p className="text-sm text-gray-600">
                Turnover rates across departments
              </p>
            </div>
          </div>
          <AttritionByDeptChart data={chartData.attritionByDeptData} />
        </motion.div>
      </motion.div>

      {/* Quick Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
      >
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-primary-600">
            {kpiData.totalEmployees > 0
              ? (
                  (kpiData.attritionCount / kpiData.totalEmployees) *
                  100
                ).toFixed(1)
              : "0.0"}
            %
          </div>
          <div className="text-sm text-gray-600">Overall Attrition Rate</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-secondary-600">
            {kpiData.totalEmployees > 0
              ? (
                  (kpiData.highRiskCount / kpiData.totalEmployees) *
                  100
                ).toFixed(1)
              : "0.0"}
            %
          </div>
          <div className="text-sm text-gray-600">High Risk Percentage</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {kpiData.avgJobSatisfaction}
          </div>
          <div className="text-sm text-gray-600">Avg Satisfaction Score</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {chartData.performanceRatingData.length > 0
              ? Math.max(...chartData.performanceRatingData.map((d) => d.count))
              : 0}
          </div>
          <div className="text-sm text-gray-600">Most Common Rating</div>
        </div>
      </motion.div>
    </main>
  );
};

export default Dashboard;
