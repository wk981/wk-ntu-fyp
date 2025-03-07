import { ProviderProps } from "@/utils"

export const FilterLayout = ({children}: ProviderProps) => {
  return (
    <div className="bg-[#F1F5F9] border-[#E2E8F0] border-2 rounded-lg px-6 py-4 flex flex-col gap-4">{children}</div>
  )
}
