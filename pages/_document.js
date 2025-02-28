import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="th">
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                {/* อนุญาต eval สำหรับ development */}
                {process.env.NODE_ENV === 'development' && (
                    <meta
                        httpEquiv="Content-Security-Policy"
                        content="script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
                    />
                )}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}