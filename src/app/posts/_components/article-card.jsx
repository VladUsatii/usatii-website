import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import Linkify from "linkify-react"

const options = {
  target: '_blank',
  className: 'underline transition skew-x-2 hover:text-shadow-md text-blue-500',
  rel: 'noopener noreferrer'
}

function ArticleCard({ post }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-bold text-2xl">{post.title}</CardTitle>
            <h3 className="text-sm">{post.excerpt}</h3>
          </CardHeader>
        </Card>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[750px] sm:max-w-[750px] overflow-y-auto max-h-[90vh]">
        <DialogClose className="absolute top-4 right-4" />
        <DialogTitle className="font-bold text-2xl">{post.title}</DialogTitle>
        <h3 className="prose text-md text-neutral-600">{post.excerpt}</h3>
        <Linkify options={options}>{post.body}</Linkify>
      </DialogContent>
    </Dialog>
  )
}

export default ArticleCard
