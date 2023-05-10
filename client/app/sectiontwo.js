import { useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/reducers/productSlice';
import styles from './sectiontwo.module.css';
import Image from 'next/image';

export default function Sectiontwo(props) {
  const sectionTwoRef = props.sectionthreeref;
  const dispatch = useDispatch();

  const handleClick = () => {
    sectionTwoRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const handleImageEnter = () => {
    dispatch(fetchProducts());
  };

  return (
    <main className={styles.sectiontwo} onMouseEnter={handleImageEnter} // add onMouseEnter event to trigger data prefetching
    >
      <div className={styles.sectiontwodiv}>
        <h1>IPHONE 14 PRO MAX</h1>
        <Image
          src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678030287/arrowdown_xtrut2.svg"
          alt="arrow-down"
          width={200}
          height={148}
          className={styles.rotateonhover}
          onClick={handleClick}
        />
      </div>
      <div className={styles.ovalblurtwo}></div>
    </main>
  );
}