import { useEffect } from 'react';
import gsap from 'gsap';
import { Power4 } from 'gsap/all';
import styles from './loader.module.css';

const Loader = () => {
  useEffect(() => {
    const duration = 0.6,
      stagger = 0.08,
      textDelay = "-=1";

    const dot = document.querySelectorAll(`.${styles.dot}`);
    const text = document.querySelectorAll(`.${styles.dot} span`);

    const tl = gsap.timeline({ repeat: -1 });
    tl
      .to(dot, { duration, y: -70, width: 70, height: 70, borderRadius: 10, rotation: 0, ease: Power4.easeOut, stagger })
      .to(text, { duration, opacity: 1, scale: 1, ease: Power4.easeOut, stagger }, textDelay)
      .to(dot, { duration, y: 0, width: 50, height: 50, borderRadius: 25, rotation: -180, ease: Power4.easeOut, stagger, delay: -0.2 })
      .to(text, { duration, opacity: 0, scale: 0, ease: Power4.easeOut, stagger }, textDelay);

    return () => tl.kill();
  }, [])

  return (
    <div className={styles.loader}>
      <div className={styles.dot} data-depth="0.20"><span>L</span></div>
      <div className={styles.dot} data-depth="0.20"><span>O</span></div>
      <div className={styles.dot} data-depth="0.20"><span>A</span></div>
      <div className={styles.dot} data-depth="0.20"><span>D</span></div>
      <div className={styles.dot} data-depth="0.20"><span>I</span></div>
      <div className={styles.dot} data-depth="0.20"><span>N</span></div>
      <div className={styles.dot} data-depth="0.20"><span>G</span></div>
    </div>
  );
};

export default Loader;
