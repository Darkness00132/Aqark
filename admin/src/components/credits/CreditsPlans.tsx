"use client";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Plan {
  id: number;
  credits: number;
  price: number;
  bonus?: number;
}

export default function Payments({ plans }: { plans: Plan[] }) {
  const handleEdit = (plan: Plan) => {
    console.log("Edit plan", plan);
  };

  const handleDelete = (plan: Plan) => {
    console.log("Delete plan", plan);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Credit Plans
      </h1>

      <div className="overflow-x-auto">
        <table className="table w-full border border-base-300 rounded-xl shadow-lg">
          <thead className="bg-base-200 text-base-content font-semibold">
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Credits</th>
              <th className="text-center">Bonus Credits</th>
              <th className="text-center">Price (EGP)</th>
              <th className="text-center">Actions</th>
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
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan)}
                    className="btn btn-sm btn-outline btn-error flex items-center gap-2"
                  >
                    <FaTrash /> Delete
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
