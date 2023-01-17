import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "components/shared-components/Loading";

const Pages = ({ match }) => (
  <Suspense fallback={<Loading cover="content" />}>
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/default`} />
      <Route
        exact
        path={`${match.url}/default`}
        component={lazy(() => import(`../dashboards/default`))}
      />
      <Redirect
        exact
        from={`${match.url}/setting`}
        to={`${match.url}/setting/edit-profile`}
      />
      <Route
        path={`${match.url}/profile`}
        component={lazy(() => import(`./profile`))}
      />
      <Route
        path={`${match.url}/setting/:type`}
        component={lazy(() => import(`./setting`))}
      />
      <Route
        exact
        path={`${match.url}/agents`}
        component={lazy(() => import(`./Agent`))}
      />
      <Route
        exact
        path={`${match.url}/agent/add`}
        component={lazy(() => import(`./Agent/Add`))}
      />
      <Route
        exact
        path={`${match.url}/agent/edit/:id`}
        component={lazy(() => import(`./Agent/Edit`))}
      />
      <Route
        exact
        path={`${match.url}/agent/p/:agent_id`}
        component={lazy(() => import(`./Agent/Profile`))}
      />
      <Route
        exact
        path={`${match.url}/bots`}
        component={lazy(() => import(`./Bot/Bot`))}
      />
      <Route
        exact
        path={`${match.url}/bot/add`}
        component={lazy(() => import(`./Bot/Add`))}
      />
      <Route
        exact
        path={`${match.url}/bot/edit/menu/:id`}
        component={lazy(() => import(`./Bot/EditMenu`))}
      />
      <Route
        exact
        path={`${match.url}/bot/edit/:id`}
        component={lazy(() => import(`./Bot/Edit`))}
      />
      <Route
        exact
        path={`${match.url}/users`}
        component={lazy(() => import(`./User/User`))}
      />
      <Route
        exact
        path={`${match.url}/report`}
        component={lazy(() => import(`./Report/Report`))}
      />
      <Route
        exact
        path={`${match.url}/test`}
        component={lazy(() => import(`./Test/Test`))}
      />
    </Switch>
  </Suspense>
);

export default Pages;
