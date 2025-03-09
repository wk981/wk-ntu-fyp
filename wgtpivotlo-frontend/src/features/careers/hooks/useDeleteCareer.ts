import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCareer } from "../api";
import { toast } from "react-toastify";

export const useDeleteCareer = () => {
    const queryClient = useQueryClient();

    const { isPending, mutateAsync } = useMutation({
      mutationFn: (id: number) => {
        return deleteCareer(id);
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['career-pagination'] });
        toast.success('Career successfully deleted');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete career');
      },
    });
    return {
      isDeletingCareer: isPending,
      mutateDeleteCareerAsync: mutateAsync,
    };
}
