import Image from "next/image";

const CarouselControls = (props) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", flexDirection: "column" }}>
      <div
        onClick={() => {
          if (props.canScrollPrev) {
            props.onPrev();
          }
        }}
        style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }}
        className={"carousel-image-enabled"}
      >
        <Image
          src="https://res.cloudinary.com/dttaprmbu/image/upload/v1677960910/arrowleft_bxtl9u.svg"
          alt="prev-arrow"
          width={50}
          height={37}
        />
      </div>
      <div
        onClick={() => {
          if (props.canScrollNext) {
            props.onNext();
          }
        }}
        style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }}
        className={"carousel-image-enabled"}
      >
        <Image
          src="https://res.cloudinary.com/dttaprmbu/image/upload/v1677960910/arrowright_tpil92.svg"
          alt="arrow-next"
          width={50}
          height={37}
        />
      </div>
    </div>
  );
};

export default CarouselControls;
