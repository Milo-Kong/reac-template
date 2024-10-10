import styles from './styles.less'
import commonStyles from '../../Common/common.less'
import useTranslationLanguage from '@/hooks/useTranslationLanguage';
import { useContext, useReducer, useState } from 'react';
import TradeProvider, { TradeContentProps, TrandeContext } from './tradeProvider';


export default function Trade() {
  return (
    <TradeProvider>
      <div className={`${commonStyles.mainView}`}>
        <div className={`${commonStyles.mainContent} ${styles.topView}`}>
          <div className={commonStyles.rowBetween} style={{alignItems:'flex-start'}}>
          </div>
        </div>
      </div>
    </TradeProvider>
  );
}
export async function clientLoader() {
  const data = await fetch('/api/data');
  return data;
}