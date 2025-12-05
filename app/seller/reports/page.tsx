'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

export default function SellerReportsPage() {
  const reports = [
    {
      name: 'Sales Report',
      description: 'Detailed breakdown of all sales and revenue',
      period: 'Last 30 Days',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Product Performance',
      description: 'Top and bottom performing products',
      period: 'Last Quarter',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Customer Insights',
      description: 'Customer behavior and purchase patterns',
      period: 'Last 90 Days',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-100 p-3 rounded-xl">
          <FileText className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Download and analyze your business reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl ${report.color} flex items-center justify-center mb-4`}>
                <report.icon className="h-6 w-6" />
              </div>
              <CardTitle>{report.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <p className="text-xs text-gray-500 mb-4">Period: {report.period}</p>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
