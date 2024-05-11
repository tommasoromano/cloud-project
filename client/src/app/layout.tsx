import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Ecommerce",
  description: "Ecommerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen w-full bg-muted flex flex-col items-center justify-center">
          <div className="w-full max-w-screen-sm p-6">{children}</div>
        </div>
      </ThemeProvider>
    </html>
  );
}
