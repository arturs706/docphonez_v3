"use client"

import styles from './page.module.css';
import Sectionone from './sectionone';
import Sectiontwo from './sectiontwo';
import Sectionthree from './sectionthree';
import Sectionfour from './sectionfour';
import Sectionfive from './sectionfive';
import Sectionsix from './sectionssix';
import Sectionseven from './sectionseven';
import Sectioneight from './sectioneight';
import Sectionnine from './sectionnine';
import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import refreshToken from '../checkCr';
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";


export default function Home() {
  const sectionOne = useRef(null);
  const sectionTwoRef = useRef(null);
  const sectionThreeRef = useRef(null);
  const sectionFourRef = useRef(null);
  const sectionFiveRef = useRef(null);
  const sectionSixRef = useRef(null);
  const sectionSevenRef = useRef(null);
  const sectionEightRef = useRef(null);
  const sectionNineRef = useRef(null);
  const dispatch = useDispatch();




  useEffect(() => {
    async function checkRefreshToken() {
      await refreshToken(dispatch);
    }
    checkRefreshToken();
  }, [dispatch]);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(sectionTwoRef.current, {
        scrollTrigger: {
          trigger: sectionThreeRef.current,
          start: "top 60%",
          end: "bottom 10%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(sectionTwoRef.current, {opacity: 1, duration: 2});
          },
          onLeave: () => {
            gsap.to(sectionTwoRef.current, {opacity: 0, duration: 2});
          },
          onLeaveBack: () => {
            gsap.to(sectionTwoRef.current, {opacity: 0, duration: 2});
          },
          onEnterBack: () => {
            gsap.to(sectionTwoRef.current, {opacity: 1, duration: 2});
          },
        },
        opacity: 1,
        duration: 2
      })})

  
    return () => {
      ctx.revert();
    };
  }, []);


  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(sectionThreeRef.current, {
        scrollTrigger: {
          trigger: sectionFiveRef.current,
          start: "50% 60%",
          end: "bottom top%",
          toggleActions: "play none none reverse",
          markers: true,
          onEnter: () => {
            gsap.to(sectionThreeRef.current, {opacity: 1, duration: 2});
          },
          onLeave: () => {
            gsap.to(sectionThreeRef.current, {opacity: 0, duration: 2});
          },
          onLeaveBack: () => {
            gsap.to(sectionThreeRef.current, {opacity: 0, duration: 2});
          },
          onEnterBack: () => {
            gsap.to(sectionThreeRef.current, {opacity: 1, duration: 2});
          },
        },
        opacity: 1,
        duration: 2
      })})

  
    return () => {
      ctx.revert();
    };
  }, []);
  
  return (
    <div className={styles.main}>
      <div ref={sectionOne}>
        <Sectionone sectiontworef={sectionTwoRef}/>
      </div>
      <div ref={sectionTwoRef} className={styles.sections}>
        <Sectiontwo sectionthreeref={sectionThreeRef}/>
      </div>
      <div ref={sectionThreeRef} className={styles.sections}>
        <Sectionthree />
      </div>
      <div ref={sectionFourRef} className={styles.sections}>
        <Sectionfour sectionFiveref = {sectionFiveRef}/>
      </div>
      <div ref={sectionFiveRef} className={styles.sections}>
        <Sectionfive />
      </div>
      <div ref={sectionSixRef} className={styles.sections}>
        <Sectionsix sectionSevenref = {sectionSevenRef}/>
      </div>
      <div ref={sectionSevenRef} className={styles.sections}>
        <Sectionseven />
      </div>
      <div ref={sectionEightRef} className={styles.sections}>
        <Sectioneight />
      </div>
      <div ref={sectionNineRef} className={styles.sections}>
        <Sectionnine />
        </div>
    </div>
  );
}
