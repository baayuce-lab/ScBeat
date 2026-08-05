import React, { useState } from 'react';
import { BarChart2, AlertTriangle, TrendingUp, Info, Activity } from 'lucide-react';
import { TensionPoint } from '../types';

interface TensionGraphProps {
  tensionCurve: TensionPoint[];
}

export const TensionGraph: React.FC<TensionGraphProps> = ({ tensionCurve }) => {
  const [selectedPoint, setSelectedPoint] = useState<TensionPoint | null>(
    tensionCurve.find((p) => p.isFlatSpot) || tensionCurve[0] || null
  );

  if (!tensionCurve || tensionCurve.length === 0) {
    return null;
  }

  const height = 220;
  const width = 700;
  const padding = 40;

  const points = tensionCurve.map((pt) => {
    const x = padding + (pt.positionPct / 100) * (width - padding * 2);
    const y = height - padding - (pt.tensionLevel / 100) * (height - padding * 2);
    return { ...pt, x, y };
  });

  const pathD = points.reduce((acc, pt, index) => {
    return index === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${
    points[0].x
  } ${height - padding} Z`;

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_#1A1A1A] space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Narrative Pacing & Tension Curve</h3>
            <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">
              Act-by-act emotional momentum & flat-spot identification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-[#1A1A1A]">
            <span className="w-3 h-3 border border-[#1A1A1A] bg-[#1A1A1A] inline-block" />
            <span>Tension Peak</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-600">
            <span className="w-3 h-3 border border-[#1A1A1A] bg-red-600 inline-block" />
            <span>Flat Spot / Sag</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="bg-[#F9F7F2] p-4 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] overflow-x-auto">
        <div className="min-w-[650px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Grid lines */}
            {[25, 50, 75, 100].map((val) => {
              const y = height - padding - (val / 100) * (height - padding * 2);
              return (
                <g key={val}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="end"
                    className="font-mono font-bold"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Act Boundary Vertical Dividers */}
            <line x1={padding + (width - padding * 2) * 0.25} y1={padding} x2={padding + (width - padding * 2) * 0.25} y2={height - padding} stroke="#1A1A1A" strokeDasharray="2 2" strokeWidth="1.5" />
            <text x={padding + (width - padding * 2) * 0.125} y={padding - 10} fill="#1A1A1A" fontSize="10" fontWeight="bold" className="font-mono uppercase tracking-widest" textAnchor="middle">ACT I</text>

            <line x1={padding + (width - padding * 2) * 0.5} y1={padding} x2={padding + (width - padding * 2) * 0.5} y2={height - padding} stroke="#1A1A1A" strokeDasharray="2 2" strokeWidth="1.5" />
            <text x={padding + (width - padding * 2) * 0.375} y={padding - 10} fill="#1A1A1A" fontSize="10" fontWeight="bold" className="font-mono uppercase tracking-widest" textAnchor="middle">ACT II-A</text>

            <line x1={padding + (width - padding * 2) * 0.75} y1={padding} x2={padding + (width - padding * 2) * 0.75} y2={height - padding} stroke="#1A1A1A" strokeDasharray="2 2" strokeWidth="1.5" />
            <text x={padding + (width - padding * 2) * 0.625} y={padding - 10} fill="#1A1A1A" fontSize="10" fontWeight="bold" className="font-mono uppercase tracking-widest" textAnchor="middle">ACT II-B</text>

            <text x={padding + (width - padding * 2) * 0.875} y={padding - 10} fill="#1A1A1A" fontSize="10" fontWeight="bold" className="font-mono uppercase tracking-widest" textAnchor="middle">ACT III</text>

            {/* Area Fill */}
            <defs>
              <linearGradient id="tensionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#tensionGrad)" />

            {/* Tension Line */}
            <path d={pathD} fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />

            {/* Data Points */}
            {points.map((pt, i) => {
              const isSelected = selectedPoint?.label === pt.label;
              return (
                <g key={i} className="cursor-pointer group" onClick={() => setSelectedPoint(pt)}>
                  {/* Outer Square */}
                  <rect
                    x={pt.x - (isSelected ? 7 : 5)}
                    y={pt.y - (isSelected ? 7 : 5)}
                    width={isSelected ? 14 : 10}
                    height={isSelected ? 14 : 10}
                    className={`transition-all stroke-2 stroke-[#1A1A1A] ${
                      pt.isFlatSpot ? 'fill-red-600' : 'fill-[#1A1A1A]'
                    }`}
                  />

                  {/* Label */}
                  <text
                    x={pt.x}
                    y={pt.y + 22}
                    fill={pt.isFlatSpot ? '#dc2626' : '#1A1A1A'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'bold'}
                    className="font-mono uppercase"
                    textAnchor="middle"
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Point Details */}
      {selectedPoint && (
        <div
          className={`p-4 border-2 border-[#1A1A1A] transition-all shadow-[3px_3px_0px_#1A1A1A] ${
            selectedPoint.isFlatSpot
              ? 'bg-rose-50/80 shadow-[3px_3px_0px_#DC2626]'
              : 'bg-[#F9F7F2]'
          }`}
        >
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {selectedPoint.isFlatSpot ? (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-[#1A1A1A]" />
              )}
              <span className="text-sm font-serif font-bold text-[#1A1A1A]">{selectedPoint.label}</span>
              <span className="text-xs font-mono text-slate-500">({selectedPoint.positionPct}% timeline mark)</span>
            </div>

            <div className="text-xs font-mono font-bold px-2.5 py-1 bg-[#1A1A1A] text-white border border-[#1A1A1A]">
              Tension Level: {selectedPoint.tensionLevel} / 100
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
            {selectedPoint.diagnosis ||
              `At this point in the script, dramatic momentum is tracking at ${selectedPoint.tensionLevel}%.`}
          </p>
        </div>
      )}
    </div>
  );
};
