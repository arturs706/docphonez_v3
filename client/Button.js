import styles from './button.module.css'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'

export default function Button({ text, onClick }) {
  const buttonref = useRef(null)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });
    tl.to(buttonref.current, {
      duration: 4.5,
      borderRadius: 50,
      width: 40,
      height: 60,
      ease: 'power4.out',
      background: 'linear-gradient(to bottom right, #66F6FF, #143DA9)',
      opacity: 1
    });
    buttonref.current.addEventListener('click', () => {
      tl.play();
      setClicked(true);
      gsap.to('.check', {
        duration: 1.5,
        scale: 3,
        right: 5,
        top: 2.5,
        ease: 'power4.out',
        opacity: 1,
        position: 'relative'
      });
      gsap.to('.check', {
        duration: 1.5,
        scale: 0.5,
        top: 2.5,
        ease: 'power4.in',
        right: 5,
        position: 'relative',
        delay: 1.5,
        opacity: 0
      });
      gsap.to('.check', {
        duration: 0.5,
        scale: 3,
        right: 5,
        position: 'relative',
        top: 2.5,
        ease: 'power4.out',
        delay: 3,
        opacity: 1
      });
    });
    tl.kill();
  }, []);
  

  return (
    <button className={styles.button} ref={buttonref}>
      {clicked ? (
        <div className="check-wrapper">
<FaCheck className="check" style={{ transformOrigin: 'center', color: 'white', fontWeight: '100' }} />
        </div>
      ) : (
        text
      )}
    </button>
  )
}
