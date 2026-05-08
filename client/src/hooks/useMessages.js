import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export const useMessageContacts = () =>
  useQuery({
    queryKey: ["message-contacts"],
    queryFn: async () => (await dashboardService.getMessageContacts()).data.contacts,
  });

export const useMessages = (partnerId) =>
  useQuery({
    queryKey: ["messages", partnerId],
    queryFn: async () => (await dashboardService.getMessages(partnerId)).data.messages,
    enabled: Boolean(partnerId),
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dashboardService.sendMessage,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.receiver] });
    },
  });
};
