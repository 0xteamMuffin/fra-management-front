import React from "react";
import { Card } from "../card";

const LegendCard = () => {
  return (
    <div className="flex-1 overflow-auto">
      <Card className="bg-white/90 border-green-300 p-3 shadow-sm rounded-lg">
        <h3 className="font-semibold text-green-900 text-center text-sm border-b pb-1">
          LEGEND
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-green-900 mt-2">
          <div className="flex items-center">
            <div className="w-5 h-0.5 border-t border-dotted border-red-500 mr-2"></div>
            <span>District Boundary</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-200 mr-2"></div>
            <span>Coast</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-700 mr-2"></div>
            <span>Forest</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-amber-50 mr-2"></div>
            <span>Island</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-sky-300 mr-2"></div>
            <span>Lake</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-lime-300 mr-2"></div>
            <span>Muhana</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-yellow-300 mr-2"></div>
            <span>Non-Potential</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-100 mr-2"></div>
            <span>Potential</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-blue-400 mr-2"></div>
            <span>Reservoir</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-blue-700 mr-2"></div>
            <span>River</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-white border mr-2"></div>
            <span>Sand</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-800 mr-2"></div>
            <span>ULB</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-rose-400 mr-2"></div>
            <span>Uninhabited</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-3 h-3 bg-purple-100 mr-2"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 0H0V6' stroke='%23a78bfa' stroke-width='0.5' fill='none'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat",
              }}
            ></div>
            <span>Waterlogged</span>
          </div>
        </div>

        <h4 className="font-medium text-green-800 text-center text-xs mt-3">
          CLAIM STATUS
        </h4>
        <div className="grid grid-cols-3 gap-1 text-xs mt-1">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-emerald-600 mr-1"></span>
            Approved
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
            Pending
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
            Rejected
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LegendCard;
