import '../styles/globals.css';
import useAuthStore from '../hooks/useAuth';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;