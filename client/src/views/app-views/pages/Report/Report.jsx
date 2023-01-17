import "./Report.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AvatarStatus from "components/shared-components/AvatarStatus";
import { DatePicker, Select, Card, Table, Tooltip, Button } from "antd";
import utils from "utils";
import { call, getReport } from "redux/axios";
import {
  FileImageOutlined,
  VideoCameraOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import moment from "moment";
const { Option } = Select;
const { RangePicker } = DatePicker;

function Report() {
  const { type } = useParams();
  const [bots, setBots] = useState([]);
  const [startDate, setStartDate] = useState(
    utils.ConvertDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)).date +
      " " +
      "00:00:00"
  );
  const [endDate, setEndDate] = useState(
    utils.ConvertDate(new Date()).date + " " + "23:59:59"
  );

  const getData = async (start, end) => {
    try {
      setStartDate(start);
      setStartDate(end);
      const data = await call(getReport({ start, end }));
      setBots(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData(startDate, endDate);
  }, []);

  const dateChange = (date) => {
    getData(
      utils.ConvertDate(date[0]._d).date + " " + "00:00:00",
      utils.ConvertDate(date[1]._d).date + " " + "23:59:59"
    );
  };

  const colms = {
    botName: {
      title: "Bot Name",
      dataIndex: "name",
      render: (_, record) => <b>{record.name}</b>,
      sorter: {
        compare: (a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          return a > b ? 1 : b > a ? -1 : 0;
        },
      },
      fixed: "left",
    },
    users: {
      title: "Unique Users",
      dataIndex: "users",
      render: (_, record) => record.users,
    },
    liveChat: {
      title: "Live Chat",
      dataIndex: "liveChat",
      render: (_, record) => record.liveChat,
    },
    lastUsed: {
      title: "Last Used",
      dataIndex: "lastUsed",
      render: (_, record) => record.lastUsed,
    },
  };

  const tableColumns = Object.keys(colms).map((key) => colms[key]);
  return (
    <>
      <div className="moni-d-main">
        <div className="moni-d-header">
          <h4>Report</h4>
          <div className="filter-wrap">
            <RangePicker
              allowClear={false}
              defaultValue={[
                moment(startDate, "YYYY-MM-DD"),
                moment(endDate, "YYYY-MM-DD"),
              ]}
              ranges={{
                Today: [moment(), moment()],
                "Current Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
                "Last Month": [
                  moment().add(-1, "M").startOf("month"),
                  moment().add(-1, "M").endOf("month"),
                ],
              }}
              format={"YYYY-MM-DD"}
              onChange={dateChange}
            />
          </div>
        </div>
        <div className="moni-data">
          <Card bodyStyle={{ padding: "0px" }}>
            <div className="table-responsive">
              <Table
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "30", "50"],
                }}
                size="middle"
                columns={tableColumns}
                dataSource={bots}
                rowKey="id"
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Report;
