import React, { useState, useEffect } from "react";
import Instance from "../AxiosConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Summary = () => {
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await Instance.get("/add/getTable");
        const filteredData = response.data.flatMap((category) =>
          category.items
            .filter((item) => item.threshold < 5)
            .map((item) => ({
              name: item.name,
              qty: item.qty,
              threshold: item.threshold,
            }))
        );

        setFilteredInventory(filteredData);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-9 ml-6 m text-black">Inventory Summary</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filteredInventory.length === 0 ? (
        <p className="text-center text-gray-600">
          No items with low threshold.
        </p>
      ) : (
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredInventory}>
              <XAxis dataKey="name" stroke="#4A90E2" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" fill="#82ca9d" name="Quantity" />
              <Bar dataKey="threshold" fill="#ff6b6b" name="Threshold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Summary;
