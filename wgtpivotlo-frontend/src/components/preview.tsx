import { Career } from '@/features/questionaire/types'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils'
import stockItemImg from '@/assets/stock-item.png'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

interface PreviewProps extends PreviewListProps {
  title: string
}

interface PreviewListProps {
  data: [Career, number][]
}

interface PreviewItemProps {
  item: [Career, number]
}

export const Preview = ({ title, data }: PreviewProps) => {
  return (
    <div className="w-full">
      <h1 className="text-lg font-bold mb-2">{title}</h1>
      <PreviewList data={data} />
    </div>
  )
}

const PreviewList = ({ data }: PreviewListProps) => {
  return (
    <ScrollArea className="w-full pb-4">
      <div className="flex flex-col gap-4 md:flex-row items-center">
        {Array.isArray(data) &&
          data.map((d, index) => <PreviewItem key={index} item={d} />)}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

const PreviewItem = ({ item }: PreviewItemProps) => {
  const [career, similarity] = item
  const similarityScore = Math.ceil(similarity * 100)

  return (
    <Card className="w-[332px] min-h-[360px] flex flex-col">
      <img
        src={stockItemImg}
        alt={`${career.title} preview image`}
        width={332}
        height={200}
        className="w-full h-[100px] object-cover rounded-t-xl"
      />
      <div className="flex flex-col flex-grow">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xl font-bold leading-6">
            {capitalizeEveryFirstChar(career.title)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col flex-grow">
          <div>
            <h2 className="font-medium mb-1">Match Score</h2>
            <Progress value={similarityScore} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {similarityScore}% match
            </p>
          </div>
          <p className="text-sm text-muted-foreground leading-5 mb-auto h-full">
            {capitalizeFirstChar(career.responsibility)}
          </p>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge className="rounded-full">
              {capitalizeEveryFirstChar(career.sector)}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {career.careerLevel}
            </Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
