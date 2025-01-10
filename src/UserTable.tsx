import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types";
import { readableDate } from "@/lib/xslx";

type Props = {
  data: User[];
};

export default function UserTable({ data }: Props) {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Citizenship Number</TableHead>
          <TableHead>Correlation ID</TableHead>
          <TableHead>Request Time</TableHead>
          <TableHead>Process Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user, index) => (
          <TableRow key={user.correlationId + index}>
            <TableCell>{user.citizenshipNumber}</TableCell>
            <TableCell>{user.correlationId}</TableCell>
            <TableCell>{readableDate(user.requestTime)}</TableCell>
            <TableCell>{user.processType}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
