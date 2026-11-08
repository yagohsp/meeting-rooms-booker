import { Eyebrow } from "@/components/eyebrow";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, action }: Props) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
      </div>
      {action}
    </div>
  );
}
