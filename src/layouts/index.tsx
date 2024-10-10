import './index.less'
import 'animate.css'
import 'react-photo-view/dist/react-photo-view.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/Common/common.less'
import { ToastInit } from '@/Components/Toast';
import { TransactionLoadingInit } from '@/Components/TransactionLoading';
import ProviderConfig from '@/provider';

// import * as Sentry from "@sentry/browser";


// Sentry.init({
//   dsn: "https://671250a2068e92096df91747ca94c4e6@o4505752206049280.ingest.sentry.io/4505752209326080",

//   // Alternatively, use `process.env.npm_package_version` for a dynamic release version
//   // if your build tool supports it.
//   release: "react-temp",
//   integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
//   // Capture Replay for 10% of all sessions,
//   // plus for 100% of sessions with an error
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
// });


ToastInit()
TransactionLoadingInit()


export default function Layout() {
  return (
    <ProviderConfig/>
  );
}