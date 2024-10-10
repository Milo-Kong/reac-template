import { Outlet } from 'umi';
import { Provider } from 'react-redux'
import { reduxStore, persistor } from '@/Redux';
import Web3ModalProvider from '@/provider/Web3ModalProvider';
import ModalProvider from '@/provider/modalProvider';
import NoticeProvider from '@/provider/NoticeProvider';
import { PersistGate } from 'redux-persist/integration/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { ReactQueryProvider } from '@/provider/ReactQueryProvider';
import ApolloClientProvider from './ApolloClientProvider';
import { ToastContainer } from 'react-toastify';

export default function ProviderConfig() {
  return (
    <Provider store={reduxStore}>
      <PersistGate loading={null} persistor={persistor}>
        <ReactQueryProvider>
          <Web3ModalProvider>
            <ModalProvider>
              <NoticeProvider>
                <ApolloClientProvider>
                  <Header/>
                  <Outlet/>
                  <Footer/>
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    className={'toastContent'}
                    theme="colored"
                  />
                </ApolloClientProvider>
              </NoticeProvider>
            </ModalProvider>
          </Web3ModalProvider>
        </ReactQueryProvider>
      </PersistGate>
    </Provider>
  );
}