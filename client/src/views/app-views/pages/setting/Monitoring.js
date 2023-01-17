import React, { Component, useState } from "react";
import { Button, Card, Form, Input, List, Switch, Table, Tooltip } from "antd";
import { DesktopOutlined, DeleteOutlined } from "@ant-design/icons";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import VideoCameraBackOutlinedIcon from "@mui/icons-material/VideoCameraBackOutlined";
import Icon from "components/util-components/Icon";
import Flex from "components/shared-components/Flex";
import { Monitor } from "@mui/icons-material";
import Alert from "components/shared-components/Alert/Alert";
import {
  call,
  monitoringAdd,
  monitoringList,
  monitoringUpdate,
  monitoringDelete,
} from "redux/axios";
import { error, success } from "components/shared-components/Toast/Toast";
import Loading from "components/shared-components/Loading";
import { BtnLoading } from "components/shared-components/BtnLoading/Loading";

export class Monitoring extends Component {
  state = {
    profiles: [],
    showAlert: false,
    showEditForm: false,
    formData: {},
    showAddForm: false,
    deleteProfileId: "",
  };

  componentDidMount = async () => {
    try {
      const res = await call(monitoringList());
      this.setState({ profiles: res.data });
    } catch (err) {
      console.log(err);
    }
  };

  deleteProfile = (id) => {
    this.setState({ deleteProfileId: id, showAlert: true });
  };

  editMonitoring = (data) => {
    const config = [
      {
        key: "snaps",
        title: "Snaps",
        icon: ImageOutlinedIcon,
        desc: "Take screenshots.",
        interval: data.screenshot_timer / 1000 / 60,
        allow: data.screenshot == 1 ? true : false,
      },
      {
        key: "videos",
        title: "Videos",
        icon: VideoCameraBackOutlinedIcon,
        desc: "Take videos.",
        interval: data.video_timer / 1000 / 60,
        length: data.video_length / 1000,
        allow: data.video == 1 ? true : false,
      },
      {
        key: "inactive",
        title: "Inactive Time",
        icon: DesktopOutlined,
        desc: "Monitoring inactive time.",
        interval: data.inactive_timer / 1000 / 60,
        allow: data.inactive == 1 ? true : false,
      },
    ];
    this.setState({ formData: { ...data, config }, showEditForm: true });
  };

  addMonitoring = () => {
    const config = [
      {
        key: "snaps",
        title: "Snaps",
        icon: ImageOutlinedIcon,
        desc: "Take screenshots.",
        interval: 300000 / 1000 / 60,
        allow: true,
      },
      {
        key: "videos",
        title: "Videos",
        icon: VideoCameraBackOutlinedIcon,
        desc: "Take videos.",
        interval: 600000 / 1000 / 60,
        length: 10000 / 1000,
        allow: true,
      },
      {
        key: "inactive",
        title: "Inactive Time",
        icon: DesktopOutlined,
        desc: "Monitoring inactive time.",
        interval: 180000 / 1000 / 60,
        allow: true,
      },
    ];
    this.setState({ formData: { config }, showAddForm: true });
  };

  render() {
    const { profiles } = this.state;

    const tableColumns = [
      {
        title: "Title",
        dataIndex: "title",
        render: (_, record) => record.title,
        sorter: {
          compare: (a, b) => {
            a = a.title.toLowerCase();
            b = b.title.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        },
      },
      {
        title: "Permissions",
        dataIndex: "permissions",
        render: (_, record) => (
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            {record.screenshot && (
              <Tooltip placement="top" title="Snapshot">
                <ImageOutlinedIcon />
              </Tooltip>
            )}
            {record.video && (
              <Tooltip placement="top" title="Video">
                <VideoCameraBackOutlinedIcon />
              </Tooltip>
            )}
            {record.inactive && (
              <Tooltip placement="top" title="Inactive">
                <DesktopOutlined style={{ fontSize: "20px" }} />
              </Tooltip>
            )}
          </div>
        ),
      },
      {
        title: "",
        dataIndex: "actions",
        render: (_, elm) => (
          <div className="text-right d-flex justify-content-end">
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.deleteProfile(elm.id);
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                className="ml-2"
                type="primary"
                ghost
                icon={<ModeEditOutlinedIcon />}
                onClick={() => {
                  this.editMonitoring(elm);
                }}
                size="small"
              />
            </Tooltip>
          </div>
        ),
      },
    ];

    const keepIt = () => {
      this.setState({ deleteProfileId: "", showAlert: false });
    };

    const deleteIt = async () => {
      if (this.state.deleteProfileId == "1") {
        this.setState({ deleteProfileId: "", showAlert: false });
        return error("You can not delete default profile");
      }
      try {
        const res = await call(
          monitoringDelete({ id: this.state.deleteProfileId })
        );
        this.setState({
          profiles: this.state.profiles.filter(
            (item) => item.id !== this.state.deleteProfileId
          ),
        });
        this.setState({ deleteProfileId: "", showAlert: false });
        success("Profile deleted successfully");
      } catch (err) {
        console.log(err);
        error("Something went wrong");
      }
    };

    const handleSave = async () => {
      const data = { ...this.state.formData };

      if (!data?.title) {
        return error("Please enter title");
      } else this.setState({ loading: true });

      this.state.formData.config.forEach((ele) => {
        if (ele.key === "inactive") {
          data.inactive = ele.allow;
          data.inactive_timer = parseInt(ele.interval) * 1000 * 60;
        } else if (ele.key === "snaps") {
          data.screenshot = ele.allow;
          data.screenshot_timer = parseInt(ele.interval) * 1000 * 60;
        } else if (ele.key === "videos") {
          data.video = ele.allow;
          data.video_timer = parseInt(ele.interval) * 1000 * 60;
          data.video_length = parseInt(ele.length) * 1000;
        }
      });

      delete data.config;

      try {
        const res = await call(monitoringUpdate(data));
        success("Changes save successfully");
        this.setState({
          formData: {},
          showEditForm: false,
          profiles: this.state.profiles.map((ele) => {
            if (ele.id == data.id) {
              ele = data;
            }
            return ele;
          }),
        });
      } catch (err) {
        console.log(err);
        error("Something went wrong");
      } finally {
        this.setState({ loading: false });
      }
    };

    const handleAdd = async () => {
      const data = { ...this.state.formData };

      if (!data?.title) {
        return error("Please enter title");
      } else this.setState({ loading: true });

      this.state.formData.config.forEach((ele) => {
        if (ele.key === "inactive") {
          data.inactive = ele.allow;
          data.inactive_timer = parseInt(ele.interval) * 1000 * 60;
        } else if (ele.key === "snaps") {
          data.screenshot = ele.allow;
          data.screenshot_timer = parseInt(ele.interval) * 1000 * 60;
        } else if (ele.key === "videos") {
          data.video = ele.allow;
          data.video_timer = parseInt(ele.interval) * 1000 * 60;
          data.video_length = parseInt(ele.length) * 1000;
        }
      });

      delete data.config;

      try {
        const res = await call(monitoringAdd(data));
        success("Profile add successfully");
        this.setState({
          formData: {},
          showAddForm: false,
          profiles: [...this.state.profiles, { id: res?.id, ...data }],
        });
      } catch (err) {
        console.log(err);
        error("Something went wrong");
      } finally {
        this.setState({ loading: false });
      }
    };

    return (
      <>
        <div className="d-flex justify-content-between mb-3">
          <h2 className="mb-4">Monitoring Profiles</h2>
          <Button type="primary" onClick={this.addMonitoring}>
            Add Profile
          </Button>
        </div>
        <Card bodyStyle={{ padding: "0px" }}>
          <div className="table-responsive">
            <Table columns={tableColumns} dataSource={profiles} rowKey="id" />
          </div>
        </Card>
        <Alert
          open={this.state.showAlert}
          animation="scale"
          data={{
            title: "Are You Sure! Want to Delete This Profile?",
            icon: "warning",
            extraInfo:
              "Do you really want to delete these profile? You can't view this in your list anymore if you delete!",
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
        {(this.state.showEditForm || this.state.showAddForm) && (
          <div className="edit-monitoring-layer">
            <div className="edit-monitoring-wrap">
              <h2 className="mb-4">
                Monitoring Profile {this.state.showAddForm ? "Add" : "Edit"}
              </h2>
              <Form.Item className="mt-2" label="Title">
                <Input
                  placeholder="Enter Title"
                  style={{ width: "300px" }}
                  defaultValue={this.state.formData?.title}
                  onChange={(e) => {
                    this.setState({
                      formData: {
                        ...this.state.formData,
                        title: e.target.value,
                      },
                    });
                  }}
                />
              </Form.Item>
              <List
                itemLayout="horizontal"
                dataSource={this.state.formData.config}
                renderItem={(item) => (
                  <List.Item>
                    <Flex
                      justifyContent="between"
                      alignItems="center"
                      className="w-100"
                    >
                      <div className="d-flex align-items-center mr-auto">
                        <Icon
                          className="h1 mb-0 text-primary"
                          type={item.icon}
                        />
                        <div className="ml-3">
                          <h4 className="mb-0">{item.title}</h4>
                          <p className="mb-0">{item.desc}</p>
                        </div>
                      </div>
                      {item.key === "videos" && (
                        <div className="ml-3">
                          <span style={{ marginLeft: "5px" }}>Length</span>
                          <Form.Item className="mb-0">
                            <Input
                              type="number"
                              style={{ width: "100px" }}
                              defaultValue={item.length}
                              onChange={(e) => {
                                this.setState({
                                  formData: {
                                    ...this.state.formData,
                                    config: this.state.formData.config.map(
                                      (elm) => {
                                        if (elm.key === item.key) {
                                          elm.length = e.target.value;
                                        }
                                        return elm;
                                      }
                                    ),
                                  },
                                });
                              }}
                              min={5}
                              max={30}
                              suffix="Sec"
                            />
                          </Form.Item>
                        </div>
                      )}
                      <div className="ml-3">
                        <span style={{ marginLeft: "5px" }}>Interval</span>
                        <Form.Item className="mb-0">
                          <Input
                            type="number"
                            style={{ width: "100px" }}
                            defaultValue={item.interval}
                            onChange={(e) => {
                              this.setState({
                                formData: {
                                  ...this.state.formData,
                                  config: this.state.formData.config.map(
                                    (elm) => {
                                      if (elm.key === item.key) {
                                        elm.interval = e.target.value;
                                      }
                                      return elm;
                                    }
                                  ),
                                },
                              });
                            }}
                            min={1}
                            max={60}
                            suffix="Min"
                          />
                        </Form.Item>
                      </div>
                      <div className="ml-4">
                        <Switch
                          defaultChecked={item.allow}
                          onChange={(checked) => {
                            this.setState({
                              formData: {
                                ...this.state.formData,
                                config: this.state.formData.config.map(
                                  (elm) => {
                                    if (elm.key === item.key) {
                                      elm.allow = checked;
                                    }
                                    return elm;
                                  }
                                ),
                              },
                            });
                          }}
                        />
                      </div>
                    </Flex>
                  </List.Item>
                )}
              />
              <div className="ml-auto d-flex justify-content-end">
                <Button
                  type="default"
                  className="mt-3 mr-2"
                  onClick={() =>
                    this.setState({
                      formData: {},
                      showEditForm: false,
                      showAddForm: false,
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  className="mt-3"
                  onClick={this.state.showAddForm ? handleAdd : handleSave}
                  disabled={
                    this.state.loading || this.state.formData?.id == "1"
                  }
                >
                  {this.state.loading ? (
                    <BtnLoading color="#fff" />
                  ) : this.state.showAddForm ? (
                    "Add Profile"
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Monitoring;
