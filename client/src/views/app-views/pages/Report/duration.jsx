import "./Report.css";
import React, { useEffect, useState } from "react";
import { Card, Table } from "antd";
import utils from "utils";
import { CloseOutlined } from "@ant-design/icons";
import { call, getDurationslots } from "redux/axios";
import { BtnLoading } from "components/shared-components/BtnLoading/Loading";

function Duration(props) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      const res = await call(getDurationslots({ ts: props.ts }));
      setSlots(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleKey = (e) => {
    e.key === "Escape" && props.hideDuration();
  };

  const tableColumns = [
    {
      title: "Start Time",
      dataIndex: "start_at",
      render: (_, record) => record.start_at,
      sorter: {
        compare: (a, b) => {
          a = a.start_at.toLowerCase();
          b = b.start_at.toLowerCase();
          return a > b ? 1 : b > a ? -1 : 0;
        },
      },
    },
    {
      title: "End Time",
      dataIndex: "end_at",
      render: (_, record) => record.end_at,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (_, record) => record.duration,
    },
  ];

  return (
    <div className="inactive-detail-popup">
      <div className="inactive-p-wrap">
        <div className="p-close-btn" onClick={props.hideDuration}>
          <CloseOutlined />
        </div>
        <div className="inactive-p-header">
          <h4>Timesheet Breakup</h4>
        </div>
        <div className="inactive-p-body">
          {loading ? (
            <div className="position-relative p-5">
              <BtnLoading />
            </div>
          ) : (
            <Card bodyStyle={{ padding: "0px" }}>
              <div className="table-responsive">
                <Table
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "30", "50"],
                  }}
                  columns={tableColumns}
                  dataSource={slots}
                  rowKey="id"
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Duration;
