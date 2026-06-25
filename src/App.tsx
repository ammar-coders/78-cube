import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import "./App.css";

interface Solve {
  id: number;
  nama: string;
  tipe_rubik: string;
  solve1: number;
  solve2: number;
  solve3: number;
  solve4: number;
  solve5: number;
  tanggal: string;
}

function calculateAo5(row: Solve): number {
  const times = [
    row.solve1,
    row.solve2,
    row.solve3,
    row.solve4,
    row.solve5,
  ];

  const sorted = [...times].sort((a, b) => a - b);

  // Buang tercepat dan terlambat
  const middle = sorted.slice(1, 4);

  return (
    middle.reduce((sum, value) => sum + value, 0) / 3
  );
}

function App() {
  const [data, setData] = useState<Solve[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const { data, error } = await supabase
      .from("solves")
      .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setData(data || []);
    setLoading(false);
    console.log("DATA:", data);
    console.log("ERROR:", error);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">
          🏆 Leaderboard Rubik
        </h1>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Ao5</th>
                <th className="px-4 py-3">S1</th>
                <th className="px-4 py-3">S2</th>
                <th className="px-4 py-3">S3</th>
                <th className="px-4 py-3">S4</th>
                <th className="px-4 py-3">S5</th>
                <th className="px-4 py-3">Rubik</th>
                <th className="px-4 py-3">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-bold">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {row.nama}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    {calculateAo5(row).toFixed(2)}
                  </td>

                  <td className="px-4 py-3">{row.solve1}</td>
                  <td className="px-4 py-3">{row.solve2}</td>
                  <td className="px-4 py-3">{row.solve3}</td>
                  <td className="px-4 py-3">{row.solve4}</td>
                  <td className="px-4 py-3">{row.solve5}</td>

                  <td className="px-4 py-3">
                    {row.tipe_rubik}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(row.tanggal).toLocaleDateString(
                      "id-ID"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="mt-4 rounded-lg bg-white p-4 text-center">
            Belum ada data solve.
          </div>
        )}
      </div>
    </div>
  );  
}

export default App;