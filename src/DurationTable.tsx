import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DurationByUser } from "@/types";
import { readableDate } from "./lib/xslx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
} from "lucide-react";
type Props = {
  data: DurationByUser[];
};

export default function DurationTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<keyof DurationByUser | undefined>(
    undefined
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    if (!sortKey) {
      return data;
    }

    return data.slice().sort((a, b) => {
      if (sortOrder === "asc") {
        return Number(a[sortKey]) - Number(b[sortKey]);
      }

      return Number(b[sortKey]) - Number(a[sortKey]);
    });
  }, [data, sortKey, sortOrder]);

  const handleSort = (
    newKey: keyof DurationByUser,
    order: "asc" | "desc" = "asc"
  ) => {
    setSortOrder(
      newKey === sortKey ? (sortOrder === "asc" ? "desc" : "asc") : order
    );
    setSortKey(newKey);
  };

  const renderSortIcon = (key: keyof DurationByUser) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={16} />;
    }

    if (sortOrder === "asc") {
      return <ArrowUpNarrowWide size={16} />;
    }

    return <ArrowDownNarrowWide size={16} />;
  };

  const averageDuration = useMemo(() => {
    return (
      sortedData.reduce((acc, user) => acc + user.durationInSeconds, 0) /
      sortedData.length
    );
  }, [sortedData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Süre Tablosu - Ortalama: {averageDuration.toFixed(2)}.s
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("index")}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="text-left">#</p>
                  {renderSortIcon("index")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("citizenshipNumber")}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="text-left">TCKN</p>
                  {renderSortIcon("citizenshipNumber")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-left">Correlation ID</p>
                </div>
              </TableHead>
              <TableHead>Connectng Date</TableHead>
              <TableHead>OCR Date</TableHead>
              <TableHead
                onClick={() => handleSort("durationInSeconds")}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="text-left">Duration</p>
                  {renderSortIcon("durationInSeconds")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((user, index) => (
              <TableRow key={user.correlationId + index}>
                <TableCell className="text-left">{user.index}</TableCell>
                <TableCell className="text-left">
                  {user.citizenshipNumber}
                </TableCell>
                <TableCell className="text-left">
                  {user.correlationId}
                </TableCell>
                <TableCell className="text-left">
                  {readableDate(user.connectingEvent.requestTime)}
                </TableCell>
                <TableCell className="text-left">
                  {readableDate(user.ocrEvent.requestTime)}
                </TableCell>
                <TableCell className="text-left">
                  {user.durationInSeconds}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
