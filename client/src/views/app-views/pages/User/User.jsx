import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, message, Button } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import AvatarStatus from "components/shared-components/AvatarStatus";
import { call, agents } from "redux/axios";
import { Link, Redirect } from "react-router-dom";
import Alert from "components/shared-components/Alert/Alert";
import { success, error } from "components/shared-components/Toast/Toast";
import Utils from "utils";

export class User extends Component {
  state = {
    agents: [],
    showAlert: false,
    deleteAgentId: "",
  };

  componentDidMount = async () => {
    try {
      const res = await call(agents());
      this.setState({ agents: res.data });
    } catch (err) {
      console.log(err);
    }
  };

  deleteAgent = (agentId) => {
    this.setState({ deleteAgentId: agentId, showAlert: true });
  };

  showAgentProfile = (agentInfo) => {
    this.setState({
      agentProfileVisible: true,
      selectedAgent: agentInfo,
    });
  };

  closeAgentProfile = () => {
    this.setState({
      agentProfileVisible: false,
      selectedAgent: null,
    });
  };

  render() {
    const { agents } = this.state;

    const tableColumns = [
      {
        title: "Agent",
        dataIndex: "fullName",
        render: (_, record) => (
          <div className="d-flex">
            <AvatarStatus
              src={
                record?.picture
                  ? Utils.avatar50(record.picture)
                  : Utils.avatar50Default(record.gender)
              }
              name={record.fullName}
              id={record.agentId}
            />
          </div>
        ),
        sorter: {
          compare: (a, b) => {
            a = a.fullName.toLowerCase();
            b = b.fullName.toLowerCase();
            return a > b ? 1 : b > a ? -1 : 0;
          },
        },
      },
      {
        title: "Email",
        dataIndex: "email",
        render: (_, record) => record.email,
        sorter: {
          compare: (a, b) => {
            a = a.email.toLowerCase();
            b = b.email.toLowerCase();
            return a > b ? 1 : b > a ? -1 : 0;
          },
        },
      },
      {
        title: "Mobile",
        dataIndex: "mobile",
        render: (_, record) => record.mobile,
        sorter: {
          compare: (a, b) => {
            a = a.mobile;
            b = b.mobile;
            return a > b ? 1 : b > a ? -1 : 0;
          },
        },
      },
      {
        title: "Gender",
        dataIndex: "gender",
        render: (_, record) => record.gender,
        sorter: {
          compare: (a, b) => {
            a = a.gender;
            b = b.gender;
            return a > b ? 1 : b > a ? -1 : 0;
          },
        },
      },
      {
        title: "Status",
        dataIndex: "isBlock",
        render: (isBlock) => (
          <Tag className="text-capitalize" color={!isBlock ? "cyan" : "red"}>
            {!isBlock ? "Active" : "Blocked"}
          </Tag>
        ),
        sorter: {
          compare: (a, b) => {
            a = a.isBlock;
            b = b.isBlock;
            return a > b ? -1 : b > a ? 1 : 0;
          },
        },
      },
      {
        title: "",
        dataIndex: "actions",
        render: (_, elm) => (
          <div className="text-right d-flex justify-content-end">
            {/* <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.deleteAgent(elm.id);
                }}
                size="small"
              />
            </Tooltip> */}
            <Tooltip title="Edit">
              <Button
                className="ml-2"
                type="primary"
                ghost
                icon={<ModeEditOutlinedIcon />}
                onClick={() => {
                  this.props.history.push("./agent/edit/" + elm.agentId);
                }}
                size="small"
              />
            </Tooltip>
          </div>
        ),
      },
    ];

    const keepIt = () => {
      this.setState({ deleteAgentId: "", showAlert: false });
    };

    const deleteIt = () => {
      this.setState({
        agents: this.state.agents.filter(
          (item) => item.agentId !== this.state.deleteAgentId
        ),
      });
      this.setState({ deleteAgentId: "", showAlert: false });
      success("Agent deleted successfully");
    };

    return (
      <>
        <div className="d-table ml-auto mb-3">
          <Link to={{ pathname: "./agent/add" }}>
            <Button type="primary">Add Agent</Button>
          </Link>
        </div>
        <Card bodyStyle={{ padding: "0px" }}>
          <div className="table-responsive">
            <Table
              columns={tableColumns}
              dataSource={agents}
              rowKey="agentId"
            />
          </div>
        </Card>
        <Alert
          open={this.state.showAlert}
          animation="scale"
          data={{
            title: "Are You Sure! Want to Delete This Record?",
            icon: "warning",
            extraInfo:
              "Do you really want to delete these records? You can't view this in your list anymore if you delete!",
            buttons: [
              {
                type: "success",
                text: "No, Keep It",
                callback: keepIt,
              },
              {
                class: "red",
                type: "error",
                text: "Yes, Delete It",
                callback: deleteIt,
              },
            ],
          }}
        />
      </>
    );
  }
}

export default User;
