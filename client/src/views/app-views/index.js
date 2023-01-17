import React, { lazy, Suspense, useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "components/shared-components/Loading";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { newCustomer, roomsList } from "redux/actions/LiveChat";
import { socketUpdate } from "redux/actions/Socket";
import moment from "moment";
import { AUTH_DATA } from "redux/constants/Auth";
import { call, getRooms } from "redux/axios";

export const AppViews = () => {
  const dispatch = useDispatch();
  const { id: userId, apiKey } = JSON.parse(localStorage.getItem(AUTH_DATA));
  const { socket } = useSelector((state) => state.socket);

  const getData = async () => {
    try {
      const res = await call(getRooms());
      dispatch(roomsList(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const ioCon = io(process.env.REACT_APP_API);
    dispatch(socketUpdate(ioCon));
    getData();
    return () => dispatch(socketUpdate(null));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      socket.emit("join", { userId, apiKey, isAgent: true });
    });
    socket.on("disconnect", () => {});
    socket.on("initLiveChat", (data) => {
      dispatch(newCustomer(data));
    });
  }, [socket]);

  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Switch>
        <Route
          path={`${APP_PREFIX_PATH}/dashboards`}
          component={lazy(() => import(`./pages`))}
        />{" "}
        {/* import(`./dashboards`) */}
        <Route
          path={`${APP_PREFIX_PATH}/apps`}
          component={lazy(() => import(`./apps`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/components`}
          component={lazy(() => import(`./components`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/pages`}
          component={lazy(() => import(`./pages`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/maps`}
          component={lazy(() => import(`./maps`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/charts`}
          component={lazy(() => import(`./charts`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/docs`}
          component={lazy(() => import(`./docs`))}
        />
        <Redirect
          from={`${APP_PREFIX_PATH}`}
          to={`${APP_PREFIX_PATH}/dashboards`}
        />
      </Switch>
    </Suspense>
  );
};

export default React.memo(AppViews);
