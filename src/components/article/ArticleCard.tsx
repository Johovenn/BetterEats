import { ArticleProps } from "@/app/(app)/article/api/getAllArticles"
import { CldImage } from "next-cloudinary"
import { useRouter } from "next/navigation"

interface ArticleCardProps{
    article: ArticleProps
    mode: 'admin' | 'search'
}

export default function ArticleCard(props: ArticleCardProps){
    const router = useRouter()

    const formattedDate = new Date(props.article.article_creation_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    const handleClickArticle = () => {
        if(props.mode === 'admin'){
            router.push(`/admin/article/${props.article.article_id}`)
        }
        else{
            router.push(`/article/${props.article.article_id}`)
        }
    }

    return(
        <div 
            className="flex w-full p-2 rounded-lg hover:shadow-lg hover:bg-slate-50 shadow-md bg-white transition-all hover:cursor-pointer"
            onClick={handleClickArticle}
        >
            <CldImage 
                alt={`${props.article.article_title} Image`}
                src={props.article.article_image}
                width={100}
                height={100}
                className="object-cover rounded-lg my-1"
                crop={"fill"}
                gravity="center"
            />
            <div className="px-3 w-full">
                <div className="flex justify-between w-full items-center">
                    <h3 className="text-lg font-semibold mb-2">{props.article.article_title}</h3>
                    <span className="text-gray-600">{`${formattedDate}`}</span>
                </div>
                <span className="line-clamp-3">{props.article.article_body}</span>
            </div>
        </div>
    )
}