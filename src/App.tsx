import { useState } from "react";
import "./App.css";
import ExcelJS from "exceljs";
import { User } from "./types";
import { calculateDurationsByUser, mapData } from "./lib/xslx";
import UserTable from "./UserTable";
import DurationTable from "./DurationTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LoaderOverlay } from "./components/LoaderOverlay";

function App() {
  const [data, setData] = useState<User[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setData([]);
    setFile(null);
    if (!e.target.files) {
      console.error("No file selected");
      return;
    }
    setIsLoading(true);
    const file = e.target.files[0];
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (!event.target) {
        console.error("Event target is null");
        setIsLoading(false);
        return;
      }
      const arrayBuffer = event.target.result as ArrayBuffer;
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        console.error("Worksheet not found");
        setIsLoading(false);
        return;
      }

      const rows = [] as string[][];
      worksheet.eachRow((row) => {
        rows.push(row.values as string[]);
      });

      setFile(file);
      console.log("all rows", rows);
      setData(
        mapData(
          rows.map((row) =>
            row.filter((cell) => cell !== null && cell !== undefined)
          )
        )
      );
      setIsLoading(false);
    };

    reader.onerror = () => {
      console.error("File reading error");
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // export calculations to excel by using calculations data
  const exportCalculations = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Calculations");
    const calculations = calculateDurationsByUser(data);

    worksheet.columns = [
      { header: "Index", key: "index" },
      { header: "TCKN", key: "citizenshipNumber" },
      { header: "Correlation ID", key: "correlationId" },
      { header: "Duration (seconds)", key: "durationInSeconds" },
      { header: "Connecting Event", key: "connectingEvent" },
      { header: "OCR Event", key: "ocrEvent" },
    ];

    calculations.forEach((calculation) => {
      worksheet.addRow({
        index: calculation.index,
        citizenshipNumber: calculation.citizenshipNumber,
        correlationId: calculation.correlationId,
        durationInSeconds: calculation.durationInSeconds,
        connectingEvent: calculation.connectingEvent.requestTime,
        ocrEvent: calculation.ocrEvent.requestTime,
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "calculations.xlsx";
      a.click();
    });
  };

  return (
    <div className="flex flex-col min-h-screen py-2">
      <header className="flex flex-col justify-center container">
        <LoaderOverlay isLoading={isLoading}>
          <Tabs defaultValue="calculation" className="w-full">
            <div className="flex space-x-4 justify-between mb-4">
              <TabsList>
                <TabsTrigger value="calculation">Hesaplama</TabsTrigger>
                <TabsTrigger value="excel">Excel</TabsTrigger>
              </TabsList>
              <div className="flex space-x-4">
                {data.length > 0 && (
                  <Button onClick={exportCalculations}>
                    Hesaplamaları İndir
                  </Button>
                )}
                <input
                  type="file"
                  accept=".xlsx"
                  value={file ? undefined : ""}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => document.querySelector("input")?.click()}
                >
                  Dosya Seç
                </Button>
              </div>
            </div>

            <TabsContent value="calculation">
              <DurationTable data={calculateDurationsByUser(data)} />
            </TabsContent>
            <TabsContent value="excel">
              <UserTable data={data} />
            </TabsContent>
          </Tabs>
        </LoaderOverlay>
      </header>
    </div>
  );
}

export default App;
