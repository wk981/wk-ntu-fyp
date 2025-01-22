import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

export interface HomeCardInterface {
  icon: string;
  title: string;
  description: string;
}

export const HomeCard = ({ icon, title, description }: HomeCardInterface) => {
  return (
    <Card className="w-[200px] h-[200px] drop-shadow-lg">
      <CardHeader className="p-4">
        <CardTitle className="flex items-start justify-between gap-2 flex-col">
          <p className="text-3xl">{icon}</p>
          <h4 className="text-lg leading-6">{title}</h4>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};
