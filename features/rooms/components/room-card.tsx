import { UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type RoomCardData = {
  id: string;
  name: string;
  capacity: number;
  resources: string[];
};

export function RoomCard({ room }: { room: RoomCardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <UsersIcon className="size-4" aria-hidden="true" />
          {room.capacity} {room.capacity === 1 ? "pessoa" : "pessoas"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {room.resources.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Recursos">
            {room.resources.map((resource) => (
              <li key={resource}>
                <Badge variant="secondary">{resource}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Sem recursos</p>
        )}
      </CardContent>
    </Card>
  );
}
