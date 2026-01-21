import React from 'react';

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
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-3">Overall Risk Assessment</h3>
      
      {/* Risk Level Indicator */}
      <div className={`p-4 rounded-lg mb-4 bg-${risk.color}-100 border-2 border-${risk.color}-500`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-2xl font-bold text-${risk.color}-700`}>
            {risk.level} RISK
          </span>
          <span className={`text-3xl`}>
            {risk.level === 'HIGH' ? '🔴' : risk.level === 'MEDIUM' ? '🟠' : risk.level === 'MODERATE' ? '🟡' : '🟢'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-${risk.color}-600`}
            style={{ width: `${risk.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Recommended Actions:</h4>
        <ul className="space-y-2">
          {getRecommendations().map((rec, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="text-blue-600 mr-2">▶</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RiskAssessment;
