import { cn } from "@/lib/utils";

interface LoadingProps {
  loading: boolean;
}

export default function Loading(props: LoadingProps) {
  return (
    <div className={cn("fixed inset-0 bg-gray-500 bg-opacity-70 flex items-center justify-center z-50", props.loading ? "block" : "hidden")}>
      <div className="loader"></div>
      
       {/* <div className="lds-ring"><div></div><div></div><div></div><div></div></div> */}
    </div>
  );
}