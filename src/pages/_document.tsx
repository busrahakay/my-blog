import { Html, Head, Main, NextScript } from "next/document";

//Sayfa başlıkları, meta veriler, favicon ve dışa bağlı stil kaynakları gibi öğeler burada eklenir.
export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Google Fonts linki */}
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap" />

                {/* SVG Favicon Ekleme */}
                <link rel="icon" href="/star.svg" type="image/svg+xml" />

                {/* Varsayılan başlık ve meta veriler */}
                <title>Cennet Blog</title> {/* Burada sekme başlığını ayarlıyoruz */}
                <meta name="description" content="Cennet'in harika blog sitesi!" />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
