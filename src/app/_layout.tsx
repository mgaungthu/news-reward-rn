import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

export default function Layout() {


  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
