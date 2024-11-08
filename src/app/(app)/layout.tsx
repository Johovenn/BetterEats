import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

export default function AppLayout({children}: {children: ReactNode}){
    return (
      <>
          <Sidebar />
          <main className="ml-10 w-full px-20 py-8">
              {children}
          </main>
      </>
    );
}