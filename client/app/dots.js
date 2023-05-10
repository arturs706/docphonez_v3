import styles from "./dots.module.css";
import classNames from "classnames";

const Dots = (props) => {
  const arr = new Array(props.itemsLength).fill(0);

  const handleDotClick = (index) => {
    props.onDotClick(index);
  };

  return (
    <div className={styles["dotscontainer"]}>
      {arr.map((_, index) => {
        const selected = index === props.selectedIndex;
        return (
          <div
            className={classNames({
              [styles.dot]: true,
              [styles.selected]: selected,
            })}
            key={index}
            onClick={() => handleDotClick(index)}
          ></div>
        );
      })}
    </div>
  );
};

export default Dots;
