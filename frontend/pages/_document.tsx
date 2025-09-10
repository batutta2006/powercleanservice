// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="de">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon-32.png" sizes="32x32" /> 
         <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> 
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

