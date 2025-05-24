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
} from "@/components/ui/dialog"

function ArticleCard({ post }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm line-clamp-3">{post.excerpt}</p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogClose className="absolute top-4 right-4" />

        <h2 className="font-bold text-2xl mb-4">{post.title}</h2>
        <article className="prose dark:prose-invert">
          {post.body}
        </article>
      </DialogContent>
    </Dialog>
  )
}

export default ArticleCard
