import { ArticleProps } from "@/app/(app)/article/api/getAllArticles"
import { CldImage } from "next-cloudinary"
import { useRouter } from "next/navigation"

interface ArticleCardProps {
    article: ArticleProps
    mode: 'admin' | 'search'
}

export default function ArticleCard(props: ArticleCardProps) {
    const router = useRouter()

    const formattedDate = new Date(props.article.article_creation_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    const handleClickArticle = () => {
        if(props.mode === 'admin') {
            router.push(`/admin/article/${props.article.article_id}`)
        } else {
            router.push(`/article/${props.article.article_id}`)
        }
    }   

    return (
        <div 
            className="flex flex-col sm:flex-row w-full p-2 rounded-lg hover:shadow-lg hover:bg-slate-50 shadow-md bg-white transition-all hover:cursor-pointer gap-3 sm:gap-0"
            onClick={handleClickArticle}
        >
            <div className="w-full sm:w-auto flex justify-center sm:block">
                <CldImage 
                    alt={`${props.article.article_title} Image`}
                    src={props.article.article_image}
                    width={100}
                    height={100}
                    className="object-cover rounded-lg my-1 w-full sm:w-[100px] h-[200px] sm:h-[100px]"
                    crop="fill"
                    gravity="center"
                />
            </div>
            <div className="px-3 w-full">
                <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-2 sm:gap-0">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{props.article.article_title}</h3>
                    <span className="text-gray-600 text-sm">{formattedDate}</span>
                </div>
                <span className="line-clamp-3 text-sm sm:text-base">{props.article.article_description}</span>
            </div>
        </div>
    )
}