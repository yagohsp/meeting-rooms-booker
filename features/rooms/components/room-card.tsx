import Link from "next/link";
import { cn } from "cn";
import { ClockIcon, UsersIcon } from "lucide-react";
import { formatDuration } from "@/lib/time";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type RoomCardData = {
  id: string;
  name: string;
  capacity: number;
  maxDurationMinutes: number;
  resources: string[];
};

export function RoomCard({ room }: { room: RoomCardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5">
            <UsersIcon className="size-4" aria-hidden="true" />
            {room.capacity} {room.capacity === 1 ? "pessoa" : "pessoas"}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-4" aria-hidden="true" />
            Até {formatDuration(room.maxDurationMinutes)} por reserva
          </span>
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
      <CardFooter>
        <Link
          href={`/reservar?sala=${room.id}&origem=salas`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Reservar
        </Link>
      </CardFooter>
    </Card>
  );
}
