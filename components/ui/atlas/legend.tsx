"use client";

import React from "react";
import { Card } from "../card";
import { useTranslation } from "react-i18next";

const LegendCard = () => {
  const { t } = useTranslation();

  const legendItems = [
    { key: "legendDistrictBoundary", style: { borderTop: "1px dotted #ef4444" } },
    { key: "legendCoast", color: "bg-green-200" },
    { key: "legendForest", color: "bg-green-700" },
    { key: "legendIsland", color: "bg-amber-50" },
    { key: "legendLake", color: "bg-sky-300" },
    { key: "legendMuhana", color: "bg-lime-300" },
    { key: "legendNonPotential", color: "bg-yellow-300" },
    { key: "legendPotential", color: "bg-green-100" },
    { key: "legendReservoir", color: "bg-blue-400" },
    { key: "legendRiver", color: "bg-blue-700" },
    { key: "legendSand", color: "bg-white", extraClass: "border" },
    { key: "legendULB", color: "bg-red-800" },
    { key: "legendUninhabited", color: "bg-rose-400" },
    {
      key: "legendWaterlogged",
      style: {
        backgroundColor: "#f5f3ff",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 0H0V6' stroke='%23a78bfa' stroke-width='0.5' fill='none'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      },
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <Card className="bg-white/90 border-green-300 p-3 shadow-sm rounded-lg">
        <h3 className="font-semibold text-green-900 text-center text-sm border-b pb-1">
          {t("legendTitle")}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-green-900 mt-2">
          {legendItems.map((item) => (
            <div key={item.key} className="flex items-center">
              {item.style && !item.color ? (
                <div className="w-5 h-0.5 mr-2" style={item.style}></div>
              ) : (
                <div
                  className={`h-3 w-3 mr-2 ${item.color || ""} ${item.extraClass || ""}`}
                  style={item.style || {}}
                ></div>
              )}
              <span>{t(item.key)}</span>
            </div>
          ))}
        </div>

        <h4 className="font-medium text-green-800 text-center text-xs mt-3">
          {t("legendClaimStatusTitle")}
        </h4>
        <div className="grid grid-cols-3 gap-1 text-xs mt-1">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-emerald-600 mr-1"></span>
            {t("statusApproved")}
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
            {t("statusPending")}
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
            {t("statusRejected")}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LegendCard;
