import React, { useEffect, useState } from "react";
import { Row, Col, Card, Badge } from "antd";
import Flex from "components/shared-components/Flex";
import AvatarStatus from "components/shared-components/AvatarStatus";
import DataDisplayWidget from "components/shared-components/DataDisplayWidget";
import ChartWidget from "components/shared-components/ChartWidget";
import { COLORS } from "constants/ChartConstant";
import {
  weeklyRevenueData,
  topProductData,
  customerChartData,
  visitorChartData,
} from "./DefaultDashboardData";
import { useSelector } from "react-redux";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import QuickreplyOutlinedIcon from "@mui/icons-material/QuickreplyOutlined";
import { call, getReportDashboard } from "redux/axios";
import Utils from "utils";

const DisplayDataSet = ({ data }) => (
  <Row gutter={16}>
    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
      <DataDisplayWidget
        icon={<SmartToyOutlinedIcon />}
        value={data.bots}
        title="Total Bots"
        color="cyan"
        vertical={true}
        avatarSize={55}
      />
      <DataDisplayWidget
        icon={<SupportAgentOutlinedIcon />}
        value={data.users}
        title="Total Users"
        color="gold"
        vertical={true}
        avatarSize={55}
      />
    </Col>
    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
      <DataDisplayWidget
        icon={<PersonOutlineOutlinedIcon />}
        value={data.agents}
        title="Total Agents"
        color="blue"
        vertical={true}
        avatarSize={55}
      />
      <DataDisplayWidget
        icon={<QuickreplyOutlinedIcon />}
        value={data.liveChat}
        title="Live Chats(week)"
        color="volcano"
        vertical={true}
        avatarSize={55}
      />
    </Col>
  </Row>
);

const TopProduct = ({ data }) => (
  <Card title="Agents">
    {data?.length > 0 &&
      data.map((elm) => (
        <Flex
          className="w-100 py-3"
          justifyContent="between"
          alignItems="center"
          key={elm.fullName}
        >
          <AvatarStatus
            shape="square"
            src={
              elm?.picture
                ? Utils.avatar50(elm.picture)
                : Utils.avatar50Default(elm.gender)
            }
            name={elm.fullName}
            subTitle={elm.category}
          />
        </Flex>
      ))}
  </Card>
);

const Customers = () => {
  const { direction } = useSelector((state) => state.theme);
  return (
    <Card title="Chats">
      <Flex>
        <div className="mr-5">
          <h2 className="font-weight-bold mb-1">523,201</h2>
          <p>
            <Badge color={COLORS[6]} />
            Chat with bot
          </p>
        </div>
        <div>
          <h2 className="font-weight-bold mb-1">379,237</h2>
          <p>
            <Badge color={COLORS[0]} />
            Live Chat
          </p>
        </div>
      </Flex>
      <div>
        <ChartWidget
          card={false}
          series={customerChartData}
          xAxis={weeklyRevenueData.categories}
          height={280}
          direction={direction}
          customOptions={{
            colors: [COLORS[6], COLORS[0]],
            legend: {
              show: false,
            },
            stroke: {
              width: 2.5,
              curve: "smooth",
            },
          }}
        />
      </div>
    </Card>
  );
};

const SalesDashboard = () => {
  const { direction } = useSelector((state) => state.theme);
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const d = await call(getReportDashboard());
      setData(d.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={14}>
          <ChartWidget
            title="Users"
            series={[
              {
                name: "Unique Users",
                data: data?.weekUsers?.val || [],
              },
            ]}
            xAxis={data?.weekUsers?.date || []}
            height={"400px"}
            direction={direction}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={10}>
          <DisplayDataSet data={data} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={7}>
          <TopProduct data={data.agentsList} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={17}>
          <Customers />
        </Col>
      </Row>
    </>
  );
};

export default SalesDashboard;
