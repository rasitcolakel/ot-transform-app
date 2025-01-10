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
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  data: User[];
};

export default function UserTable({ data }: Props) {
  return (
    <Card className="w-full">
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>TCKN</TableHead>
              <TableHead>Correlation ID</TableHead>
              <TableHead>Request Time</TableHead>
              <TableHead>Process Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user, index) => (
              <TableRow key={user.correlationId + index}>
                <TableCell className="text-left">
                  {user.citizenshipNumber}
                </TableCell>
                <TableCell className="text-left">
                  {user.correlationId}
                </TableCell>
                <TableCell className="text-left">
                  {readableDate(user.requestTime)}
                </TableCell>
                <TableCell className="text-left">{user.processType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
