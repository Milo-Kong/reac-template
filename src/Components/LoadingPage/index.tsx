
import styles from './index.less'
export default function LoadingPage() {
  return(
    <div className={styles.loadingView} style={{
      width:window.innerWidth,
      height:window.innerHeight
    }}>
      <span className={styles.loadingText}>loading...</span>
    </div>
  )
}