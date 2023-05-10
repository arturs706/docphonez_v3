import styles from './navicon.module.css'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toggleHamburger } from '@/redux/reducers/navigationSlice';

export default function Hamburger() {
  const dispatch = useDispatch();
  const { isHamburgerOpen } = useSelector(state => state.navigation);

    const handleClick = () => {
        dispatch(toggleHamburger());
    };

  const iconClasses = `${styles['nav-icon-1']} ${isHamburgerOpen ? styles.open : ''}`;
  return (
    <div className={styles.wrapper}>
      <div className={iconClasses} onClick={handleClick}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
