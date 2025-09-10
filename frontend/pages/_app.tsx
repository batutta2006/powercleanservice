// frontend/pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";
import FloatingActions from "../components/FloatingActions";

export default function MyApp({ Component, pageProps }: AppProps) {
  return(
   <>
     <Component {...pageProps} />;
     <FloatingActions />
  </>
 );
}


