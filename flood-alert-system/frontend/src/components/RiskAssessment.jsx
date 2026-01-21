import React from 'react';
import { Shield, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const RiskAssessment = ({ stations }) => {
  const calculateOverallRisk = () => {
    const dangerCount = stations.filter(s => s.currentReading?.status === 'DANGER').length;
    const warningCount = stations.filter(s => s.currentReading?.status === 'WARNING').length;
    
    if (dangerCount > 0) return { level: 'HIGH', color: 'red', percentage: 85 };
    if (warningCount >= 2) return { level: 'MEDIUM', color: 'orange', percentage: 60 };
    if (warningCount === 1) return { level: 'MODERATE', color: 'yellow', percentage: 40 };
    return { level: 'LOW', color: 'green', percentage: 15 };
  };

  const risk = calculateOverallRisk();

  const getRecommendations = () => {
    switch(risk.level) {
      case 'HIGH':
        return [
          'Evacuate low-lying areas immediately',
          'Close roads near affected rivers',
          'Alert emergency response teams',
          'Monitor stations every 5 minutes'
        ];
      case 'MEDIUM':
        return [
          'Issue flood watch for affected areas',
          'Prepare emergency response teams',
          'Monitor water levels closely',
          'Alert nearby communities'
        ];
      case 'MODERATE':
        return [
          'Continue routine monitoring',
          'Keep emergency teams on standby',
          'Review evacuation procedures'
        ];
      default:
        return [
          'Normal operations - continue monitoring',
          'Maintain equipment and sensors',
          'Review historical data patterns'
        ];
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-teal-600" />
        <h3 className="font-bold text-lg text-slate-800">Risk Assessment</h3>
      </div>
      
      {/* Risk Level Indicator */}
      <div className={`p-5 rounded-xl mb-5 border-2 ${
        risk.color === 'red' ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300' :
        risk.color === 'orange' ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300' :
        risk.color === 'yellow' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' :
        'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-2xl font-bold ${
            risk.color === 'red' ? 'text-red-700' :
            risk.color === 'orange' ? 'text-orange-700' :
            risk.color === 'yellow' ? 'text-yellow-700' :
            'text-green-700'
          }`}>
            {risk.level} RISK
          </span>
          {risk.level === 'HIGH' ? <AlertTriangle className="w-8 h-8 text-red-600" /> :
           risk.level === 'MEDIUM' ? <AlertTriangle className="w-8 h-8 text-orange-600" /> :
           risk.level === 'MODERATE' ? <Info className="w-8 h-8 text-yellow-600" /> :
           <CheckCircle className="w-8 h-8 text-green-600" />}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all ${
              risk.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
              risk.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              risk.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${risk.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="font-semibold text-sm mb-3 text-slate-700">Recommended Actions:</h4>
        <ul className="space-y-2.5">
          {getRecommendations().map((rec, index) => (
            <li key={index} className="flex items-start text-sm p-2.5 hover:bg-slate-50 rounded-lg transition-colors">
              <CheckCircle className="w-4 h-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RiskAssessment;
