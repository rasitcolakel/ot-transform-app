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

type Props = {
  data: DurationByUser[];
};

export default function DurationTable({ data }: Props) {
  console.log("DurationTable", data);
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>TCKN</TableHead>
          <TableHead>Cor ID</TableHead>
          <TableHead>Connectng Date</TableHead>
          <TableHead>OCR Date</TableHead>
          <TableHead>Süre (s)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user, index) => (
          <TableRow key={user.correlationId + index}>
            <TableCell>{user.citizenshipNumber}</TableCell>
            <TableCell>{user.correlationId}</TableCell>
            <TableCell>
              {readableDate(user.connectingEvent.requestTime)}
            </TableCell>
            <TableCell>{readableDate(user.ocrEvent.requestTime)}</TableCell>
            <TableCell>{user.durationInSeconds}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
