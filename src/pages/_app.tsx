import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/globals.css";
import type { AppProps } from "next/app";

//Next.js ile sitenin tüm sayfalarında uygulanacak olan ortak yapı oluşturuldu. (footer ve header)
export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Header />
            <Component {...pageProps} />
            <Footer />
        </>
    );
}
