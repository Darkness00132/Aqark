"use client";

import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Plan {
  id: number;
  credits: number;
  price: number;
  bonus?: number;
}

const plans: Plan[] = [
  { id: 1, credits: 100, price: 100 },
  { id: 2, credits: 200, price: 250, bonus: 50 },
  { id: 3, credits: 500, price: 600, bonus: 100 },
  { id: 4, credits: 1000, price: 1100, bonus: 200 },
];

export default function Payments() {
  const handleEdit = (plan: Plan) => {
    console.log("Edit plan", plan);
  };

  const handleDelete = (plan: Plan) => {
    console.log("Delete plan", plan);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        خطط شراء العملات
      </h1>

      <div className="overflow-x-auto">
        <table className="table w-full border border-base-300 rounded-xl shadow-lg">
          <thead className="bg-base-200 text-base-content font-semibold">
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">العملات</th>
              <th className="text-center">العملات المجانية</th>
              <th className="text-center">السعر (EGP)</th>
              <th className="text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr
                key={plan.id}
                className="hover:bg-base-100 transition-colors duration-200"
              >
                <th className="text-center">{index + 1}</th>
                <td className="text-center">{plan.credits}</td>
                <td className="text-center">{plan.bonus || 0}</td>
                <td className="text-center text-primary font-bold">
                  {plan.price}
                </td>
                <td className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="btn btn-sm btn-outline btn-secondary flex items-center gap-2"
                  >
                    <FaEdit /> تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(plan)}
                    className="btn btn-sm btn-outline btn-error flex items-center gap-2"
                  >
                    <FaTrash /> حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
