import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Pagination, Navigation } from "swiper";

function Product({ align, icon, item }) {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const { data } = await axios.get(item.url, { params: item.params });
      Array.isArray(data.products) && setData(data.products);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={align === "r" ? "chat-right" : "chat-left"}>
      <div className="chat-icon">
        <img src={icon} alt="" />
      </div>
      <div className="chat-mes bg p-1">
        <div className="product-wrapper">
          {data.length > 0 && (
            <Swiper
              grabCursor={true}
              slidesPerView={1}
              spaceBetween={10}
              loop={true}
              pagination={{
                type: "fraction",
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
            >
              {data.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="product-item">
                    <div className="product-title">{item.title}</div>
                    <div className="product-img">
                      <img src={item.image} />
                    </div>
                    <div className="product-desc">{item.description}</div>
                    <a
                      href={item.url}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                    >
                      <Button variant="contained" size="small">
                        See Details
                      </Button>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="chat-time">
          {moment(item?.createdAt, "YYYY-MM-DD h:mm:ss").format("h:mm a")}
        </div>
      </div>
    </div>
  );
}

export default Product;
