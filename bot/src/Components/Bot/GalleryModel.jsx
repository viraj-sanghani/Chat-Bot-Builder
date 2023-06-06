import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Pagination } from "swiper";
import { Button } from "@mui/material";
import icons from "../../Utils/icons";
import { useDispatch, useSelector } from "react-redux";
import { setGalleryModel } from "../../redux/reducers/botReducer";
import { getFile } from "../../Utils/files";

function GalleryModel() {
  const dispatch = useDispatch();
  const { showGalleryModel, galleryData } = useSelector((state) => state.bot);
  return (
    showGalleryModel &&
    galleryData.data?.length > 0 && (
      <div className="model-container">
        <Button
          className="model-close-btn"
          onClick={() => dispatch(setGalleryModel({ show: false }))}
        >
          {icons.close}
        </Button>
        <Swiper
          initialSlide={galleryData.slide}
          grabCursor={true}
          slidesPerView={1}
          spaceBetween={10}
          loop={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
        >
          {galleryData.data.map((item, i) => (
            <SwiperSlide key={i}>
              <img src={getFile("widget", item.name)} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  );
}

export default GalleryModel;
