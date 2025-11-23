import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  campaigns: {
    list: ["campaigns"],
    details: (id: string) => ["campaigns", "details", id],
  },
};

export const queryClient = new QueryClient();
