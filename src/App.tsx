import { useState } from "react";
import "./App.css";
import ExcelJS from "exceljs";
import { User } from "./types";
import { calculateDurationsByUser, mapData } from "./lib/xslx";
import UserTable from "./UserTable";
import DurationTable from "./DurationTable";

function App() {
  const [data, setData] = useState<User[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.error("No file selected");
      return;
    }
    const file = e.target.files[0];
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (!event.target) {
        console.error("Event target is null");
        return;
      }
      const arrayBuffer = event.target.result as ArrayBuffer;
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        console.error("Worksheet not found");
        return;
      }

      const rows = [] as string[][];
      worksheet.eachRow((row) => {
        rows.push(row.values as string[]);
      });

      console.log("rows", rows);

      setData(
        mapData(
          rows.map((row) =>
            row.filter((cell) => cell !== null && cell !== undefined)
          )
        )
      );
    };

    reader.readAsArrayBuffer(file);
  };

  console.log("data", data);
  console.log("durations", calculateDurationsByUser(data));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <header className="flex flex-col items-center justify-center container">
        <input type="file" accept=".xlsx" onChange={handleFileUpload} />
        <UserTable data={data} />
        <DurationTable data={calculateDurationsByUser(data)} />
      </header>
    </div>
  );
}

export default App;
