import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import utils from "utils";
import { call, getSnaps, getUsers } from "redux/axios";
import { Button, DatePicker, Select } from "antd";
import moment from "moment";
const { Option } = Select;

function Snapshot() {
  const history = useHistory();
  const { type, id } = useParams();
  const snapType = type || false;
  const user_id = type === "user" ? id : false;
  const ts_id = type === "ts" ? id : false;
  const [snaps, setSnaps] = useState([]);
  const [date, setDate] = useState(utils.ConvertDate(new Date()).date);
  const [user, setUser] = useState(user_id);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await call(getUsers());
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
    fetchSnaps(date, 1);
  }, []);

  const fetchSnaps = async (d, p) => {
    let start = d + " " + "00:00:00";
    let end = d + " " + "23:59:59";
    try {
      const res =
        snapType === "user"
          ? await call(getSnaps({ userId: user_id, start, end, page: p }))
          : await call(getSnaps({ ts_id }));
      setSnaps(p > 1 ? [...snaps, ...res.data] : [...res.data]);
      setPage(p + 1);
      if (res?.pages) {
        setTotalPages(res.pages - 1);
      } else setTotalPages(totalPages - 1);
    } catch (err) {
      console.log(err);
    }
  };
  const dateChange = (d, ds) => {
    setPage(1);
    if (d === null) {
      fetchSnaps(utils.ConvertDate(new Date()).date, 1);
    } else {
      setDate(ds);
      fetchSnaps(ds, 1);
    }
  };

  const loadMore = () => {
    fetchSnaps(date, page);
  };

  const userChange = (id) => {
    history.push({ pathname: "./snapshot/user/" + id });
  };

  const userChangeHead = (id) => {
    history.push({ pathname: "./../user/" + id });
  };

  const { compId } = JSON.parse(localStorage.getItem("auth_data"));

  return (
    <div className="moni-d-main">
      <div className="moni-d-header">
        <h4>
          Snapshots{" "}
          {user_id &&
            users.length > 0 &&
            `( ${users.filter((u) => u.id == user_id)[0]?.name} )`}
        </h4>
        <div className="filter-wrap">
          {snapType === "user" && (
            <DatePicker
              allowClear={false}
              className="date-picker"
              defaultValue={moment(date, "YYYY-MM-DD")}
              format={"YYYY-MM-DD"}
              onChange={dateChange}
            />
          )}
          {snapType && (
            <Select
              className="ml-3"
              showSearch
              style={{ width: 250 }}
              placeholder="Select a user"
              optionFilterProp="children"
              onChange={userChangeHead}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          )}
        </div>
      </div>
      <div className="moni-data">
        {!snapType ? (
          <div className="user-selection-container">
            <div className="user-selection-title">
              Choose an user to view snapshots
            </div>
            <Select
              showSearch
              style={{ width: 250 }}
              placeholder="Select a user"
              optionFilterProp="children"
              onChange={userChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </div>
        ) : (
          <>
            <div className="moni-d-main-container">
              <div className="moni-d-wrap">
                {snaps.length > 0 ? (
                  <>
                    {snaps.map((snap, i) => (
                      <div className="moni-d-card" key={i}>
                        <div className="moni-d-time">
                          {utils.getTime(snap.created_at)}
                        </div>
                        <a
                          target="_blank"
                          href={utils.snap(snap.file, compId, user_id)}
                          className="moni-d-img"
                        >
                          <img
                            src={utils.snap150(snap.file, compId, user_id)}
                            alt={snap.file}
                          />
                        </a>
                      </div>
                    ))}
                    {totalPages > 0 && (
                      <div className="load-btn-wrap w-100 d-flex justify-content-center my-2">
                        <Button type="primary" onClick={loadMore}>
                          Load More
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-data w-100">
                    <h4 className="mt-5">
                      <center>No data found</center>
                    </h4>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Snapshot;
